import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { ArticleItemComponent } from './article-item/article-item.component';
import { ArticleComponent } from './article/article.component';

import { breadcrumbsArticleResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-article.resolver';

const routes: Routes = [
  {
    path: '',
    component: ArticleComponent
  },
  {
    path: '!:id',
    component: ArticleItemComponent,
    data: {
      breadcrumbs: { dataKey: 'post.attributes.title' },
    },
    resolve: {
      post: breadcrumbsArticleResolver,
    },
  },
];

/**
 * @ignore
 */
@NgModule({
  imports: [RouterModule.forChild(routes), LocalizeRouterModule.forChild(routes)],
  exports: [RouterModule, LocalizeRouterModule],
})
export class ArticlesRoutingModule {}
