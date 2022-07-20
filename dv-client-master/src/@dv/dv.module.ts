import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { DV_CONFIG } from './services/config.service';

@NgModule()
export class DvModule {
  constructor(@Optional() @SkipSelf() parentModule: DvModule) {
    if (parentModule) {
      throw new Error('DvModule is already loaded. Import it in the AppModule only!');
    }
  }

  static forRoot(config): ModuleWithProviders<DvModule> {
    return {
      ngModule: DvModule,
      providers: [
        {
          provide: DV_CONFIG,
          useValue: config
        }
      ]
    };
  }
}
