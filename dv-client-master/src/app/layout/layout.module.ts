import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DvSidebarModule } from '@dv/components';
import { DvSharedModule } from '@dv/shared.module';

// import { ChatPanelModule } from './components/chat-panel/chat-panel.module';
import { ContentModule } from './components/content/content.module';
import { NavbarModule } from './components/navbar/navbar.module';
// import { QuickPanelModule } from './components/quick-panel/quick-panel.module';
import { ToolbarModule } from './components/toolbar/toolbar.module';

import { LayoutComponent } from './layout.component';

@NgModule({
  declarations: [
    LayoutComponent
  ],
  imports: [
    RouterModule,

    DvSharedModule,
    DvSidebarModule,

    // ChatPanelModule,
    ContentModule,
    NavbarModule,
    // QuickPanelModule,
    ToolbarModule
  ],
  exports: [
    LayoutComponent
  ]
})

export class LayoutModule { }
