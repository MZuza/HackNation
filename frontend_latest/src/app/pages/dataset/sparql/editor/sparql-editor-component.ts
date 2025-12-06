import { AfterViewInit, Component, forwardRef, NgZone, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Ace } from 'ace-builds';
import ace, { EditSession } from 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-sparql';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/theme-chrome';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Parser } from 'sparqljs';

import { SparqlService } from '@app/pages/dataset/sparql/sparql.service';

/**
 * Sparql Editor Component
 */
@Component({
    selector: 'app-sparql-editor',
    templateUrl: './sparql-editor-component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SparqlEditorComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => SparqlEditorComponent),
            multi: true,
        },
    ],
    standalone: true,
    imports: [TranslatePipe],
})
export class SparqlEditorComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
  /**
   * Sparql Mode
   * @type {any}
   */
  private static SparqlMode = ace.require('ace/mode/sparql').Mode;

  /**
   * Determines if prefix editor should be visible
   * @type {boolean}
   */
  isPrefixesHidden = true;

  /**
   * Query editor
   * @type {Ace.Editor}
   */
  queryEditor: Ace.Editor;

  /**
   * Prefix editor
   * @type {Ace.Editor}
   */
  prefixesEditor: Ace.Editor;

  /**
   * Determines if form is valid
   * @type {boolean}
   */
  private isValid = false;

  /**
   * Query editor value
   * @type {string}
   */
  private queryEditorValue: string;

  /**
   * @ignore
   */
  private destroy$: Subject<void> = new Subject<void>();

  /**
   * @ignore
   */
  constructor(private readonly sparqlService: SparqlService, private readonly ngZone: NgZone) {}

  /**
   * Cleanups editor instance
   * @param editor
   */
  private static cleanupEditor(editor: Ace.Editor) {
    editor?.destroy();
    editor?.container.remove();
  }

  /**
   * Toggle prefixes editor
   */
  togglePrefixes(): void {
    this.isPrefixesHidden = !this.isPrefixesHidden;
  }

  /**
   * Initialize editors
   */
  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.setupPrefixEditor(SparqlEditorComponent.SparqlMode);
      this.setupEditor(SparqlEditorComponent.SparqlMode);
      fromEvent(this.queryEditor, 'change')
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.ngZone.run(() => {
            this.onTouched();
            const value = this.validateEditors();
            this.onValueChange(value);
          });
        });
    });
  }

  /**
   * Cleanups component
   */
  ngOnDestroy() {
    SparqlEditorComponent.cleanupEditor(this.queryEditor);

    SparqlEditorComponent.cleanupEditor(this.prefixesEditor);

    this.destroy$.next();
  }

  /**
   * Validates query provided be user
   * @returns {string}
   */
  validateEditors(): string {
    this.queryEditor.session.clearAnnotations();
    this.isValid = true;
    const combined = this.prefixesEditor.getValue() + '\n' + this.queryEditor.getValue();
    const parser = new Parser();
    try {
      parser.parse(combined);
    } catch ({ hash, message }) {
      const sliceEndIndex = message.indexOf('Expecting');
      const trimmedMessage = sliceEndIndex >= 0 ? message.slice(0, sliceEndIndex).trim() : message;
      this.queryEditor.session.setAnnotations([
        {
          row: hash ? hash?.line - this.prefixesEditor.session.getLength() : 0,
          column: 0,
          text: trimmedMessage,
          type: 'error',
        },
      ]);
      this.isValid = false;
    }
    return this.queryEditor.getValue();
  }

  /**
   * Validates input value
   * @returns {null | {invalid: boolean}}
   */
  validate() {
    if (!this.isValid || this.queryEditor.getValue().length === 0) {
      return {
        invalid: true,
      };
    }
    return null;
  }

  /**
   * Registers on change
   * @param fn
   */
  registerOnChange(fn: any): void {
    this.onValueChange = fn;
  }

  /**
   * Registers on touched
   * @param fn
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Writes value
   * @param obj
   */
  writeValue(obj: any): void {
    this.queryEditorValue = obj;
    if (!!this.queryEditor) {
      this.queryEditor.setSession(new EditSession(obj));
      this.queryEditor.session.setMode(new SparqlEditorComponent.SparqlMode());
      this.validateEditors();
    }
  }

  /**
   * Setups profile editor
   * @param SparqlMode
   */
  private setupPrefixEditor(SparqlMode): void {
    this.sparqlService.getDefaultPrefixes().subscribe(res => {
      this.prefixesEditor = ace.edit('prefixes');
      this.prefixesEditor.setSession(new EditSession(res));
      this.prefixesEditor.session.setMode(new SparqlMode());
      this.prefixesEditor.setTheme('ace/theme/chrome');
    });
  }

  /**
   * Setups editor
   * @param SparqlMode
   */
  private setupEditor(SparqlMode): void {
    this.queryEditor = ace.edit('editor');
    this.queryEditor.setSession(new EditSession(this.queryEditorValue));
    this.queryEditor.session.setMode(new SparqlMode());
    this.queryEditor.setTheme('ace/theme/chrome');
    this.queryEditor.commands.addCommand({
      name: 'goToNextElement',
      bindKey: { win: 'Ctrl+q', mac: 'Command-q' },
      exec: function () {
        document.querySelector<HTMLInputElement>('.sparql--example').focus();
      },
      readOnly: false,
    });
    this.queryEditor.commands.addCommand({
      name: 'goToPrevElement',
      bindKey: { win: 'Ctrl+e', mac: 'Command-e' },
      exec: function () {
        document.querySelector<HTMLInputElement>('.btn-link').focus();
      },
      readOnly: false,
    });
    this.queryEditor.on('focus', function () {
      document.getElementsByClassName('ace_text-input')[1].setAttribute('aria-describedby', 'labelForSr');
    });
  }

  /**
   * Input value change callback
   * @param value
   */
  private onValueChange: (value: any) => void = value => {};

  /**
   * Input touched callback
   */
  private onTouched: () => void = () => {};
}
