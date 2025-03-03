import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  APP_CHANGE_MENU_COLLAPSING,
  APP_TOGGLE_MENU_OPENING,
  AppChangeMenuCollapsing,
  AppToggleMenuOpening,
} from '@app/app.actions';
import { MinaState } from '@app/app.setup';
import { selectActiveNode, selectAppMenu } from '@app/app.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { CONFIG, getAvailableFeatures } from '@shared/constants/config';
import { removeParamsFromURL } from '@shared/helpers/router.helper';
import { AppMenu } from '@shared/types/app/app-menu.type';
import { MinaNode } from '@shared/types/core/environment/mina-env.type';
import { ThemeType } from '@shared/types/core/theme/theme-types.type';
import { filter, map, tap } from 'rxjs';

interface MenuItem {
  name: string;
  icon: string;
  tooltip?: string;
}

const MENU_ITEMS: MenuItem[] = [
  { name: 'Dashboard', icon: 'dashboard' },
  { name: 'Explorer', icon: 'explore' },
  { name: 'Resources', icon: 'analytics' },
  {
    name: 'Snark Worker',
    icon: 'engineering',
    tooltip: 'Decentralised Snark Worker',
  },
  { name: 'Storage', icon: 'hard_drive' },
  // { name: 'Logs', icon: 'code_blocks' },
  { name: 'Network', icon: 'account_tree' },
  { name: 'Tracing', icon: 'grid_view' },
  { name: 'Web Node', icon: 'blur_circular' },
  { name: 'Benchmarks', icon: 'dynamic_form' },
  { name: 'Experiments', icon: 'science' },
];

@UntilDestroy()
@Component({
  selector: 'mina-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column flex-between h-100 pb-12' },
})
export class MenuComponent extends ManualDetection implements OnInit {
  menuItems: MenuItem[] = this.allowedMenuItems;
  menu: AppMenu;
  currentTheme: ThemeType;
  appIdentifier: string = CONFIG.identifier;
  activeNode: MinaNode;
  activeRoute: string;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private router: Router,
    private store: Store<MinaState>
  ) {
    super();
  }

  ngOnInit(): void {
    this.currentTheme = localStorage.getItem('theme') as ThemeType;
    this.listenToCollapsingMenu();
    this.listenToActiveNodeChange();
    let lastUrl: string;
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event: any) => event.url),
        filter((url) => url !== lastUrl),
        tap((url) => (lastUrl = url)),
        map(removeParamsFromURL),
        map((url) => url.split('/')[1])
      )
      .subscribe((url: string) => {
        this.activeRoute = url;
        this.detect();
      });
  }

  changeTheme(): void {
    const theme: ThemeType = this.document.body.classList.contains(
      ThemeType.LIGHT
    )
      ? ThemeType.DARK
      : ThemeType.LIGHT;
    this.currentTheme = theme;
    const transitionToken: string = 'theme-transition';

    this.document.body.classList.add(transitionToken);
    this.document.body.classList.remove(ThemeType.DARK, ThemeType.LIGHT);
    this.document.body.classList.add(theme);

    localStorage.setItem('theme', theme);
    setTimeout(() => this.document.body.classList.remove(transitionToken), 700);
  }

  private listenToCollapsingMenu(): void {
    this.store
      .select(selectAppMenu)
      .pipe(untilDestroyed(this))
      .subscribe((menu: AppMenu) => {
        this.menu = menu;
        this.detect();
      });
  }

  private listenToActiveNodeChange(): void {
    this.store
      .select(selectActiveNode)
      .pipe(
        untilDestroyed(this),
        filter((node) => !!node)
      )
      .subscribe((node: MinaNode) => {
        this.activeNode = node;
        this.menuItems = this.allowedMenuItems;
        this.detect();
      });
  }

  private get allowedMenuItems(): MenuItem[] {
    const features = getAvailableFeatures(this.activeNode || ({} as any));
    return MENU_ITEMS.filter((opt: MenuItem) =>
      features.find((f) => f === opt.name.toLowerCase().split(' ').join('-'))
    );
  }

  showHideMenu(): void {
    if (this.menu.isMobile) {
      this.store.dispatch<AppToggleMenuOpening>({
        type: APP_TOGGLE_MENU_OPENING,
      });
    }
  }

  toggleMenu(): void {
    if (this.menu.isMobile) {
      this.showHideMenu();
    } else {
      this.collapseMenu();
    }
  }

  collapseMenu(): void {
    this.store.dispatch<AppChangeMenuCollapsing>({
      type: APP_CHANGE_MENU_COLLAPSING,
      payload: !this.menu.collapsed,
    });
  }
}
