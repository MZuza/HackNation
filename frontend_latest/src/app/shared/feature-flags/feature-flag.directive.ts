import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

import { FeatureFlagService } from '@app/services/feature-flag.service';
import { IFeatureFlag } from '@app/services/models/feature-flag';

@Directive({
    selector: '[featureFlag]',
    standalone: true
})
export class FeatureFlagDirective implements OnInit {

    @Input() featureFlag: string;

    @Input() featureFlagElse: TemplateRef<any>;

    constructor(
        private viewContainerRef: ViewContainerRef,
        private templateRef: TemplateRef<any>,
        private featureFlagService: FeatureFlagService
    ) {
    }

    ngOnInit() {

        this.featureFlagService.featureFlags.subscribe(
            (flagList: IFeatureFlag[]) => {
                const isEnabled = this.featureFlagService.validateFlag(this.featureFlag, flagList);
                if (isEnabled) {
                    this.viewContainerRef.createEmbeddedView(this.templateRef);
                    return;
                }
                if (!!this.featureFlagElse) {
                    this.viewContainerRef.createEmbeddedView(this.featureFlagElse);
                }
            }
        );
    }
}
