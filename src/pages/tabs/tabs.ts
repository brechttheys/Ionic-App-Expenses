import { Component } from '@angular/core';

import { TripsOverviewPage } from '../trips-overview/trips-overview';
import { TransferOverviewPage } from '../transfer-overview/transfer-overview';
import { ContactsOverviewPage } from '../contacts-overview/contacts-overview';
import { ConfigPage } from '../config/config';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = TripsOverviewPage
  tab2Root = ContactsOverviewPage
  tab3Root = TransferOverviewPage
  tab4Root = ConfigPage

  constructor() {}
}
