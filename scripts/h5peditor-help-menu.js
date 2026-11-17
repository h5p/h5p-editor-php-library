/* global ns */
/**
 * This file contains helper functions for the editor help menu.
 */

/**
 * Generate markup for the help menu button.
 *
 * @param {string} [helpMenuId] Unique menu id.
 * @returns {string} HTML
 */
ns.createHelpMenuButton = (helpMenuId = 'h5peditor-help-menu') => `
  <div class="h5peditor-help">
    <button class="h5peditor-help-button" type="button" aria-expanded="false" aria-haspopup="menu" aria-controls="${helpMenuId}">
      ${ns.t('core', 'getHelp')}
    </button>
    <ul class="h5peditor-help-menu" id="${helpMenuId}" role="menu" hidden>
      <li class="h5p-tutorial-item" role="none">
        <a class="h5p-tutorial-url" role="menuitem" target="_blank">
          ${ns.t('core', 'viewTutorial')}
        </a>
      </li>
      <li class="h5p-example-item" role="none">
        <a class="h5p-example-url" role="menuitem" target="_blank">
          ${ns.t('core', 'viewExample')}
        </a>
      </li>
    </ul>
  </div>
`;

/**
 * Attach behavior to the button and its menu.
 *
 * @param {HTMLElement} button The menu button.
 * @param {HTMLElement} menu The menu associated with the button.
 */
ns.attachMenuBehavior = (button, menu) => {
  if (!button || !menu) {
    return;
  }
  const menuItems = [...menu.querySelectorAll('[role="menuitem"]')];
  const itemCount = menuItems.length;
  if (itemCount === 0) {
    return;
  }
  const getCurrentIndex = (event) => {
    const item = event.target.closest('[role="menuitem"]');
    return menuItems.indexOf(item);
  };
  const closeOnDocumentClick = (event) => {
    if (!menu.contains(event.target) && !button.contains(event.target)) {
      closeHelpMenu(false);
    }
  };
  const closeHelpMenu = (restoreFocus) => {
    document.removeEventListener('click', closeOnDocumentClick);
    button.ariaExpanded = 'false';
    menu.hidden = true;

    if (restoreFocus) {
      button.focus();
    }
  };
  const openHelpMenu = () => {
    button.ariaExpanded = 'true';
    menu.hidden = false;
    document.addEventListener('click', closeOnDocumentClick);
  };

  button.addEventListener('click', (event) => {
    event.preventDefault();
    if (button.ariaExpanded === 'true') {
      closeHelpMenu(true);
    }
    else {
      openHelpMenu();
    }
  });

  button.addEventListener('keydown', (event) => {
    menu.classList.remove('is-pointer-focus');
    let focusIndex;
    switch (event.key) {
      case 'Enter':
      case ' ':
        focusIndex = 0;
        break;
      case 'ArrowUp':
        focusIndex = itemCount - 1;
        break;
      case 'ArrowDown':
        focusIndex = 0;
        break;
      default:
        break;
    }

    if (focusIndex !== undefined) {
      event.preventDefault();
      openHelpMenu();
      menuItems[focusIndex].focus();
    }
  });

  menu.addEventListener('keydown', (event) => {
    menu.classList.remove('is-pointer-focus');
    const currentIndex = getCurrentIndex(event);
    let nextIndex;

    switch (event.key) {
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % itemCount;
        break;
      case 'ArrowUp':
        nextIndex = (currentIndex - 1 + itemCount) % itemCount;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = itemCount - 1;
        break;
      case 'Escape':
        event.preventDefault();
        closeHelpMenu(true);
        return;
      case 'Tab':
        closeHelpMenu(false);
        return;
      default:
        break;
    }

    if (nextIndex !== undefined) {
      event.preventDefault();
      menuItems[nextIndex].focus();
    }
  });

  menu.addEventListener('pointerover', (event) => {
    menu.classList.add('is-pointer-focus');
    const currentIndex = getCurrentIndex(event);
    if (currentIndex !== -1) {
      menuItems[currentIndex].focus();
    }
  });
};
