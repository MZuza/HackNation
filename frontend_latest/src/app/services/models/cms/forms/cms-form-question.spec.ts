import { TestBed } from '@angular/core/testing';
import { CmsFormQuestion } from '@app/services/models/cms/forms/cms-form-question';

describe('CmsFormQuestion', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CmsFormQuestion],
    });
  });

  it('should create', () => {
    const form = {
      id: '1',
      type: 'type',
      value: {
        label: 'label',
        help_text: 'test',
        value: 'test',
        checked: false,
        placeholder: '',
        input_label: 'input_label',
        input_help_text: '',
        input_default_value: '',
        input_placeholder: '',
      },
    };
    const value = {
      label: 'label',
      help_text: 'test',
      value: 'test',
      checked: false,
      placeholder: '',
      input_label: 'input_label',
      input_help_text: '',
      input_default_value: '',
      input_placeholder: '',
    };
    const formObject = new CmsFormQuestion(form);
    expect(formObject.id).toBe('1');
    expect(formObject.type).toBe('type');
    expect(formObject.value).toStrictEqual(value);
    expect(formObject.htmlElementName).toBe('');
    expect(formObject.htmlElementType).toBe('');
  });
});
