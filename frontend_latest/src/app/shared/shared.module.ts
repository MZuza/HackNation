import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';
import { ApiSourceLinkComponent } from './api-source-link/api-source-link.component';
import { LinkButtonComponent } from './buttons/link-button/link-button.component';
import { CmsBlock2Component } from './cms/cms-block2/cms-block2.component';
import { CmsFormComponent } from './cms/cms-forms/cms-form/cms-form.component';
import { CmsLandingPageComponent } from './cms/cms-landing-page/cms-landing-page.component';
import { CmsStaticPageComponent } from './cms/cms-static-page/cms-static-page.component';
import { CallToActionComponent } from './cms/widget/call-to-action/call-to-action.component';
import { HeadingComponent } from './cms/widget/heading/heading.component';
import { ImageComponent } from './cms/widget/image/image.component';
import { RawTextEmbedComponent } from './cms/widget/raw-text/raw-text-embed/raw-text-embed.component';
import { RawTextComponent } from './cms/widget/raw-text/raw-text.component';
import { SloganComponent } from './cms/widget/slogan/slogan.component';
import { VideoComponent } from './cms/widget/video/video.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { DatasetAutocompleteDirective } from './directives/dataset-autocomplete.directive';
import { FixedSidebarDirective } from './directives/fixed-sidebar.directive';
import { FocusTrapDirective } from './directives/focus-trap/focus-trap.directive';
import { HistoryEntryComponent } from './history-entry/history-entry.component';
import { ItemsPerPageComponent } from './items-per-page/items-per-page.component';
import { LoaderComponent } from './loader/loader.component';
import { MathCaptchaComponent } from './math-captcha/math-captcha.component';
import { NoResultsFoundComponent } from './no-results-found/no-results-found.component';
import { NotificationsFrontComponent } from './notifications-front/notifications-front.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PaginationComponent } from './pagination/pagination.component';
import { CapitalizeFirstLetterPipe } from './pipes/capitalize-first-letter.pipe';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { KeyvalueOrderPipe } from './pipes/keyvalue-order.pipe';
import { ResourceColumnDataPipe } from './pipes/resource-column-data.pipe';
import { SanitizeUrlPipe } from './pipes/sanitize-url.pipe';
import { TranslateDateFormatPipe } from './pipes/translate-date-format.pipe';
import { TruncateTextPipe } from './pipes/truncate-text.pipe';
import { ResourceChartTableComponent } from './resource-chart-table/resource-chart-table.component';
import { ResourceTableNoFiltersComponent } from './resource-table-no-filters/resource-table-no-filters.component';
import { SearchResultsViewComponent } from './result-list/results/search-results-view/search-results-view.component';
import { RodoModalComponent } from './rodo-modal/rodo-modal.component';
import { SearchSuggestComponent } from './search-suggest/search-suggest.component';
import { SingleselectComponent } from './singleselect/singleselect.component';
import { StarRatingComponent } from './star-rating/star-rating.component';
import { SubscribeButtonComponent } from './subscribe-button/subscribe-button.component';
import { TooltipModule } from './tooltip/tooltip.module';
import { TourProgressComponent } from './tour/progress/tour-progress/tour-progress.component';
import { TourButtonComponent } from './tour/tour-button/tour-button.component';
import { TourPickerComponent } from './tour/tour-picker/tour-picker.component';
import { WriteUsInfoComponent } from './write-us-info/write-us-info.component';

import { ApplicationItemResultsComponent } from '@app/pages/applications/application-item-results/application-item-results.component';
import { ApplicationResultsComponent } from '@app/pages/applications/application-results/application-results.component';
import { ArticleResultsComponent } from '@app/pages/articles/article-results/article-results.component';
import { DatasetResultsComponent } from '@app/pages/dataset/dataset-results/dataset-results.component';
import { DatasetSelectedFiltersComponent } from '@app/pages/dataset/dataset-selected-filters/dataset-selected-filters.component';
import { RegionsSearchComponent } from '@app/pages/dataset/regions-search/regions-search.component';
import { InstitutionItemResultsComponent } from '@app/pages/institutions/institution-item-results/institution-item-results.component';
import { InstitutionItemSelectedFiltersComponent } from '@app/pages/institutions/institution-item-selected-filters/institution-item-selected-filters.component';
import { InstitutionListViewFiltersComponent } from '@app/pages/institutions/institution-list-view-filters/institution-list-view-filters.component';
import { InstitutionResultsComponent } from '@app/pages/institutions/institution-results/institution-results.component';
import { InstitutionSelectedFiltersComponent } from '@app/pages/institutions/institution-selected-filters/institution-selected-filters.component';
import { BreadcrumbsComponent } from '@app/shared/breadcrumbs/breadcrumbs.component';
import { CmsBlockComponent } from '@app/shared/cms/cms-block/cms-block.component';
import { CmsFormQuestionComponent } from '@app/shared/cms/cms-forms/cms-form-question/cms-form-question.component';
import { WidgetAbstractComponent } from '@app/shared/cms/widget/widget.abstract.component';
import { CollapsibleTextComponent } from '@app/shared/collapsible-text/collapsible-text.component';
import { DownloadLinkComponent } from '@app/shared/download-link/download-link.component';
import { DropdownToogleComponent } from '@app/shared/expandable-multiselect/dropdown-toogle/dropdown-toogle.component';
import { ExpandableMultiselectListComponent } from '@app/shared/expandable-multiselect/expandable-multiselect-list/expandable-multiselect-list.component';
import { ExpandableMultiselectSearchInputComponent } from '@app/shared/expandable-multiselect/expandable-multiselect-search-input/expandable-multiselect-search-input.component';
import { ExpandableMultiselectComponent } from '@app/shared/expandable-multiselect/expandable-multiselect.component';
import { FeatureFlagsModule } from '@app/shared/feature-flags/feature-flags.module';
import { FeedbackComponent } from '@app/shared/feedback/feedback.component';
import { FileSizeComponent } from '@app/shared/file-size/file-size.component';
import { ListViewFiltersActionButtonsComponent } from '@app/shared/filters/list-view-action-buttons/list-view-filters-action-buttons.component';
import { ListViewFilterAbstractComponent } from '@app/shared/filters/list-view-filter-abstract/list-view-filter-abstract.component';
import { ListViewSelectedFiltersAbstractComponent } from '@app/shared/filters/list-view-selected-filters-abstract/list-view-selected-filters.abstract.component';
import { RemoveButtonComponent } from '@app/shared/filters/list-view-selected-filters/remove-button/remove-button.component';
import { SelectedFiltersComponent } from '@app/shared/filters/list-view-selected-filters/selected-filters.component';
import { FoundResultsCountersAndSortComponent } from '@app/shared/found-results-counters-and-sort/found-results-counters-and-sort.component';
import '@app/shared/helpers/string.helper';
import { MultiselectComponent } from '@app/shared/multiselect/multiselect.component';
import { NewDataContactComponent } from '@app/shared/new-data-contact/new-data-contact.component';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { InnerHtmlAppendPipe } from '@app/shared/pipes/inner-text-append.pipe';
import { SanitizeHtmlPipe } from '@app/shared/pipes/sanitize-html.pipe';
import { StripHtmlWithExceptionPipe } from '@app/shared/pipes/strip-html-with-exception';
import { StripHtmlPipe } from '@app/shared/pipes/strip-html.pipe';
import { TextToLinksPipe } from '@app/shared/pipes/text-to-links.pipe';
import { TimespanPipe } from '@app/shared/pipes/timespan.pipe';
import { KeywordsComponent } from '@app/shared/result-list/related-components/keywords/keywords.component';
import { NotesComponent } from '@app/shared/result-list/related-components/notes/notes.component';
import { DefaultResultItemComponent } from '@app/shared/result-list/result-item/default-result-item/default-result-item.component';
import { ResultItemImageComponent } from '@app/shared/result-list/result-item/result-item-image/result-item-image.component';
import { ResultListComponent } from '@app/shared/result-list/result-list.component';
import { DetailsResultItemComponent } from '@app/shared/result-list/right-column/details-result-item/details-result-item.component';
import { PermissionDirective } from '@app/shared/user-permissions/permission.directive';
import { AppShellNoRenderDirective } from '@app/ssr/app-shell-no-render.directive';
import { AppShellRenderDirective } from '@app/ssr/app-shell-render.directive';
@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        OverlayModule,
        TranslateModule.forChild({
            parser: {
                provide: TranslateParser,
                useClass: TranslateICUParser,
            },
        }),
        TimepickerModule,
        CarouselModule,
        LocalizeRouterModule,
        FontAwesomeModule,
        TooltipModule,
        FeatureFlagsModule,
        MatDialogModule,
        SanitizeHtmlPipe,
        StripHtmlPipe,
        StripHtmlWithExceptionPipe,
        InnerHtmlAppendPipe,
        PaginationComponent,
        NotificationsComponent,
        NotificationsFrontComponent,
        NotificationsServerComponent,
        BreadcrumbsComponent,
        MultiselectComponent,
        SingleselectComponent,
        WriteUsInfoComponent,
        TimespanPipe,
        DateFormatPipe,
        TruncateTextPipe,
        TextToLinksPipe,
        FocusTrapDirective,
        StarRatingComponent,
        HistoryEntryComponent,
        DatasetAutocompleteDirective,
        TranslateDateFormatPipe,
        ApiSourceLinkComponent,
        SubscribeButtonComponent,
        RodoModalComponent,
        LinkButtonComponent,
        WidgetAbstractComponent,
        ImageComponent,
        CmsBlockComponent,
        CmsStaticPageComponent,
        SloganComponent,
        RawTextComponent,
        VideoComponent,
        CallToActionComponent,
        RawTextEmbedComponent,
        CmsLandingPageComponent,
        HeadingComponent,
        ResourceTableNoFiltersComponent,
        SearchSuggestComponent,
        DetailsResultItemComponent,
        KeywordsComponent,
        NotesComponent,
        DefaultResultItemComponent,
        ResultListComponent,
        LoaderComponent,
        ResultListComponent,
        ExpandableMultiselectComponent,
        ExpandableMultiselectSearchInputComponent,
        ExpandableMultiselectListComponent,
        DropdownToogleComponent,
        SelectedFiltersComponent,
        RemoveButtonComponent,
        DatasetSelectedFiltersComponent,
        ListViewFiltersActionButtonsComponent,
        ListViewFilterAbstractComponent,
        ListViewSelectedFiltersAbstractComponent,
        InstitutionListViewFiltersComponent,
        InstitutionSelectedFiltersComponent,
        InstitutionResultsComponent,
        InstitutionItemSelectedFiltersComponent,
        SearchResultsViewComponent,
        InstitutionItemSelectedFiltersComponent,
        ApplicationResultsComponent,
        ResultItemImageComponent,
        InstitutionItemSelectedFiltersComponent,
        ArticleResultsComponent,
        InstitutionItemSelectedFiltersComponent,
        DatasetResultsComponent,
        InstitutionItemSelectedFiltersComponent,
        FoundResultsCountersAndSortComponent,
        InstitutionItemResultsComponent,
        CmsFormComponent,
        CmsFormQuestionComponent,
        CapitalizeFirstLetterPipe,
        ApplicationItemResultsComponent,
        NewDataContactComponent,
        FileSizeComponent,
        DownloadLinkComponent,
        CollapsibleTextComponent,
        SanitizeUrlPipe,
        PermissionDirective,
        MathCaptchaComponent,
        FeedbackComponent,
        AppShellRenderDirective,
        AppShellNoRenderDirective,
        KeyvalueOrderPipe,
        ItemsPerPageComponent,
        TourButtonComponent,
        TourProgressComponent,
        NoResultsFoundComponent,
        ResourceChartTableComponent,
        CmsBlock2Component,
        TourPickerComponent,
        ResourceColumnDataPipe,
        FixedSidebarDirective,
        RegionsSearchComponent,
        ConfirmDialogComponent,
        ClickOutsideDirective,
    ],
    exports: [
        SanitizeHtmlPipe,
        StripHtmlPipe,
        StripHtmlWithExceptionPipe,
        InnerHtmlAppendPipe,
        PaginationComponent,
        NotificationsComponent,
        NotificationsFrontComponent,
        NotificationsServerComponent,
        BreadcrumbsComponent,
        MultiselectComponent,
        SingleselectComponent,
        WriteUsInfoComponent,
        TimespanPipe,
        DateFormatPipe,
        TruncateTextPipe,
        TextToLinksPipe,
        FocusTrapDirective,
        StarRatingComponent,
        HistoryEntryComponent,
        DatasetAutocompleteDirective,
        TranslateDateFormatPipe,
        ApiSourceLinkComponent,
        SubscribeButtonComponent,
        RodoModalComponent,
        LinkButtonComponent,
        CmsBlockComponent,
        RawTextEmbedComponent,
        ResourceTableNoFiltersComponent,
        SearchSuggestComponent,
        LoaderComponent,
        CmsStaticPageComponent,
        ResourceTableNoFiltersComponent,
        DetailsResultItemComponent,
        KeywordsComponent,
        NotesComponent,
        DefaultResultItemComponent,
        ResultListComponent,
        ResourceTableNoFiltersComponent,
        ExpandableMultiselectComponent,
        ExpandableMultiselectSearchInputComponent,
        ExpandableMultiselectListComponent,
        DropdownToogleComponent,
        SelectedFiltersComponent,
        RemoveButtonComponent,
        DatasetSelectedFiltersComponent,
        ListViewFiltersActionButtonsComponent,
        ListViewFilterAbstractComponent,
        ListViewSelectedFiltersAbstractComponent,
        InstitutionListViewFiltersComponent,
        InstitutionSelectedFiltersComponent,
        InstitutionResultsComponent,
        InstitutionItemSelectedFiltersComponent,
        SearchResultsViewComponent,
        InstitutionItemSelectedFiltersComponent,
        ApplicationResultsComponent,
        ResultItemImageComponent,
        InstitutionItemSelectedFiltersComponent,
        ArticleResultsComponent,
        InstitutionItemSelectedFiltersComponent,
        DatasetResultsComponent,
        InstitutionItemSelectedFiltersComponent,
        InstitutionItemResultsComponent,
        FoundResultsCountersAndSortComponent,
        InstitutionItemResultsComponent,
        CmsFormComponent,
        CmsFormQuestionComponent,
        CapitalizeFirstLetterPipe,
        ApplicationItemResultsComponent,
        NewDataContactComponent,
        FileSizeComponent,
        DownloadLinkComponent,
        CollapsibleTextComponent,
        PermissionDirective,
        MathCaptchaComponent,
        FeedbackComponent,
        AppShellRenderDirective,
        AppShellNoRenderDirective,
        KeyvalueOrderPipe,
        ItemsPerPageComponent,
        TourButtonComponent,
        NoResultsFoundComponent,
        ResourceChartTableComponent,
        CmsBlock2Component,
        TourPickerComponent,
        FixedSidebarDirective,
        TooltipModule,
        FeatureFlagsModule,
        CmsLandingPageComponent,
        ClickOutsideDirective,
    ],
})
export class SharedModule {}
