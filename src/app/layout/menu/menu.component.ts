import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { selectActiveNode, selectAppMenu } from '@app/app.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppMenu } from '@shared/types/app/app-menu.type';
import { APP_CHANGE_MENU_COLLAPSING, APP_TOGGLE_MENU_OPENING, AppChangeMenuCollapsing, AppToggleMenuOpening } from '@app/app.actions';
import { ThemeType } from '@shared/types/core/theme/theme-types.type';
import { DOCUMENT } from '@angular/common';
import { MinaNode } from '@shared/types/core/environment/mina-env.type';
import { filter } from 'rxjs';

interface MenuItem {
  name: string;
  icon: string;
}

const MENU_ITEMS: MenuItem[] = [
  { name: 'Dashboard', icon: 'dashboard' },
  { name: 'Resources', icon: 'analytics' },
  { name: 'Network', icon: 'account_tree' },
  { name: 'Tracing', icon: 'grid_view' },
  { name: 'Web Node', icon: 'blur_circular' },
  { name: 'Explorer', icon: 'explore' },
  { name: 'Benchmarks', icon: 'dynamic_form' },
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

  menuItems: MenuItem[] = [];
  menu: AppMenu;
  currentTheme: ThemeType;

  private activeNode: MinaNode;

  constructor(@Inject(DOCUMENT) private readonly document: Document,
              private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.currentTheme = localStorage.getItem('theme') as ThemeType;
    this.listenToCollapsingMenu();
    this.listenToActiveNodeChange();
  }

  changeTheme(): void {
    const theme: ThemeType = this.document.body.classList.contains(ThemeType.LIGHT) ? ThemeType.DARK : ThemeType.LIGHT;
    this.currentTheme = theme;
    const transitionToken: string = 'theme-transition';

    this.document.body.classList.add(transitionToken);
    this.document.body.classList.remove(ThemeType.DARK, ThemeType.LIGHT);
    this.document.body.classList.add(theme);

    localStorage.setItem('theme', theme);
    setTimeout(() => this.document.body.classList.remove(transitionToken), 700);
  }

  private listenToCollapsingMenu(): void {
    this.store.select(selectAppMenu)
      .pipe(untilDestroyed(this))
      .subscribe((menu: AppMenu) => {
        this.menu = menu;
        this.detect();
      });
  }

  private listenToActiveNodeChange(): void {
    this.store.select(selectActiveNode)
      .pipe(
        untilDestroyed(this),
        filter(Boolean),
      )
      .subscribe((node: MinaNode) => {
        this.activeNode = node;
        this.menuItems = this.allowedMenuItems;
        this.detect();
      });
  }

  private get allowedMenuItems(): MenuItem[] {
    return MENU_ITEMS.filter((opt: MenuItem) => this.activeNode.features.find(f => f === opt.name.toLowerCase().split(' ').join('-')));
  }

  toggleMenu(): void {
    if (this.menu.isMobile) {
      this.store.dispatch<AppToggleMenuOpening>({ type: APP_TOGGLE_MENU_OPENING });
      return;
    }
    this.store.dispatch<AppChangeMenuCollapsing>({ type: APP_CHANGE_MENU_COLLAPSING, payload: !this.menu.collapsed });
  }
}