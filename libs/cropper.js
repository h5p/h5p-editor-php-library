/**
 * Simple image cropping tool.
 */
function Cropper(options) {
  this.options = options;
  this.container = options.container;

  /**
   * Generic pointerup event handler.
   *
   * @param {string} handle String name for selector handle not to be hidden.
   */
  const onPointerUp = (handle) => {
    return (event) => {
      event.preventDefault();
      event.stopPropagation();
      window.onpointerup = undefined;
      window.onpointermove = undefined;
      this.toggleHandles(true, handle);
    }
  }

  /**
   * Set of pointer event handler functions for moving the selector.
   */

  const handleMove = () => {
    const onPointerDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.pointerOffset.x = event.clientX - this.selector.offsetLeft;
      this.pointerOffset.y = event.clientY - this.selector.offsetTop;
      this.pointerOffset.xSpan = this.selector.offsetLeft + this.selector.offsetWidth;
      this.pointerOffset.ySpan = this.selector.offsetTop + this.selector.offsetHeight;
      this.toggleHandles(false);
      window.onpointerup = onPointerUp();
      window.onpointermove = onPointerMove;
    }

    const onPointerMove = (event) => {
      let x = event.clientX - this.pointerOffset.x;
      let y = event.clientY - this.pointerOffset.y;
      if (x < this.canvas.offsetLeft) {
        x = this.canvas.offsetLeft;
      }
      if (x > this.canvas.offsetLeft + this.canvas.offsetWidth - this.selector.offsetWidth) {
        x = this.canvas.offsetLeft + this.canvas.offsetWidth - this.selector.offsetWidth;
      }
      if (y < this.canvas.offsetTop) {
        y = this.canvas.offsetTop;
      }
      if (y > this.canvas.offsetTop + this.canvas.offsetHeight - this.selector.offsetHeight) {
        y = this.canvas.offsetTop + this.canvas.offsetHeight - this.selector.offsetHeight;
      }
      this.selector.style.left = x + 'px';
      this.selector.style.top = y + 'px';
      if (options.selector.mask) {
        this.updateMask();
      }
    }

    this.selector.onpointerdown = onPointerDown;
  }

  /**
   * Set of pointer event handling functions for resizing the selector.
   *
   * @param {string} type String containing labels that denote the resizing handle location.
   */
  const handleResize = (type) => {
    if (!this.handles[type]) {
      return;
    }
    const types = type.split('_');

    const onPointerDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.pointerOffset.xSpan = this.selector.offsetLeft + this.selector.offsetWidth - options.selector.min.width;
      this.pointerOffset.ySpan = this.selector.offsetTop + this.selector.offsetHeight - options.selector.min.height;
      this.toggleHandles(false, type);
      window.onpointerup = onPointerUp(type);
      window.onpointermove = onPointerMove;
    }

    /**
     * Generic selector resizing handler.
     *
     * @param {boolean} top Flag denoting top handle location.
     * @param {boolean} left Flag denoting left handle location.
     * @param {boolean} bottom Flag denoting bottom handle location.
     * @param {boolean} right Flag denoting right handle location.
     */
    const handleAll = (top, left, bottom, right) => {
      let width;
      let height;
      const parentBounds = this.canvas.parentElement.getBoundingClientRect();
      if (top) {
        const ySpan = this.selector.offsetTop + this.selector.offsetHeight;
        let top = event.pageY - parentBounds.top;
        if (top < 0) {
          top = 0;
        }
        if (top > this.pointerOffset.ySpan) {
          top = this.pointerOffset.ySpan;
        }
        height = ySpan - top;
        this.selector.style.top = top + 'px';
      }
      if (left) {
        const xSpan = this.selector.offsetLeft + this.selector.offsetWidth;
        let left = event.pageX - parentBounds.left;
        if (left < 0) {
          left = 0;
        }
        if (left > this.pointerOffset.xSpan) {
          left = this.pointerOffset.xSpan;
        }
        width = xSpan - left;
        this.selector.style.left = left + 'px';
      }
      if (bottom) {
        const maxHeight = this.canvas.offsetHeight - this.selector.offsetTop;
        height = event.pageY - parentBounds.top - this.selector.offsetTop;
        if (height < 0) {
          height = 0;
        }
        if (this.selector.offsetTop + height > this.canvas.offsetHeight) {
          height = maxHeight;
        }
      }
      if (right) {
        const maxWidth = this.canvas.offsetWidth - this.selector.offsetLeft;
        width = event.pageX - parentBounds.left - this.selector.offsetLeft;
        if (width < 0) {
          width = 0;
        }
        if (this.selector.offsetLeft + width > this.canvas.offsetWidth) {
          width = maxWidth;
        }
      }
      if (width) {
        if (width < options.selector.min.width) {
          width = options.selector.min.width;
        }
        this.selector.style.width = width + 'px';
      }
      if (height) {
        if (height < options.selector.min.height) {
          height = options.selector.min.height;
        }
        this.selector.style.height = height + 'px';
      }
    }

    const onPointerMove = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const map = {
        top: false,
        left: false,
        bottom: false,
        right: false
      }
      for (let item of types) {
        map[item] = true;
      }
      handleAll(map.top, map.left, map.bottom, map.right);
      if (options.selector.mask) {
        this.updateMask();
      }
    }

    this.handles[type].onpointerdown = onPointerDown;
  }

  /**
   * Callback for canvas.context.toBlob image retrieval.
   *
   * @param {Blob} blob Raw image data.
   */
  const handleBlob = (blob) => {
    const url = URL.createObjectURL(blob);
    this.image = new Image();
    this.image.onload = () => {
      URL.revokeObjectURL(url);
      this.loadImage();
    }
    this.image.src = url;
  }

  /**
   * Shows/hides mask around selector.
   *
   * @param {boolean} on true/false denotes on/off
   */
  this.toggleMask = (on) => {
    for (let item in this.masks) {
      this.masks[item].style.display = on ? 'block' : 'none';
    }
  }

  /**
   * Updates the size & position of the 4 mask areas.
   */
  this.updateMask = () => {
    let item;
    if (this.masks.top) {
      item = this.masks.top.style;
      item.width = this.selector.offsetWidth + 'px';
      item.height = this.selector.offsetTop + 'px';
      item.top = 0;
      item.left = this.selector.offsetLeft + 'px';
    }
    if (this.masks.right) {
      item = this.masks.right.style;
      item.width = this.canvas.width - (this.selector.offsetLeft + this.selector.offsetWidth) + 'px';
      item.height = this.canvas.height + 'px';
      item.right = 0;
      item.top = 0;
    }
    if (this.masks.bottom) {
      item = this.masks.bottom.style;
      item.width = this.selector.offsetWidth + 'px';
      item.height = this.canvas.height - (this.selector.offsetTop + this.selector.offsetHeight) + 'px';
      item.bottom = 0;
      item.left = this.selector.offsetLeft + 'px';
    }
    if (this.masks.left) {
      item = this.masks.left.style;
      item.width = this.selector.offsetLeft + 'px';
      item.height = this.canvas.height + 'px';
      item.left = 0;
      item.top = 0;
    }
  }

  /**
   * Shows/hides selector handles.
   *
   * @param {boolean} on true/false denotes on/off
   */
  this.toggleHandles = (on, except) => {
    for (let item in this.handles) {
      if (item === except) {
        continue;
      }
      this.handles[item].style.opacity = on ? 1 : 0;
    }
  }

  /**
   * Shows/hides selector.
   *
   * @param {boolean} on true/false denotes on/off
   */
  this.toggleSelector = (on) => {
    this.selector.style.display = on ? 'block' : 'none';
    if (options.selector.mask) {
      this.updateMask();
      this.toggleMask(on);
    }
  }

  /**
   * Shows one buttons section and hides the other.
   *
   * @param {string} section Buttons section to be shown.
   */
  this.toggleSection = (section) => {
    for (let item in this.sections) {
      this.sections[item].style.display = section === item ? 'inline-block' : 'none';
    }
  }

  /**
   * Computes width & height for an image so that it fits within the canvvas.
   *
   * @param {Image} image image to fit
   * @param {Canvas} canvas to fit image in
   */
  this.fit = (image, canvas) => {
    if (!canvas) {
      canvas = this.canvas;
    }
    let width;
    let height;
    if (image.width >= image.height) {
      width = canvas.width;
      height = image.height / image.width * width;
      if (height > canvas.height) {
        height = canvas.height;
        width = image.width / image.height * height;
      }
    }
    else {
      height = canvas.height;
      width = image.width / image.height * height;
      if (width > canvas.width) {
        width = canvas.width;
        height = image.height / image.width * width;
      }
    }
    return { width, height };
  }

  /**
   * Draws image within canvas.
   */
  this.loadImage = () => {
    const { width, height } = this.fit(this.image);
    this.margins.left = (this.canvas.width - width) / 2;
    this.margins.top = (this.canvas.height - height) / 2;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = options.canvas.background;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.drawImage(this.image, this.margins.left, this.margins.top, width, height);
    this.image.onload = undefined;
  }

  /**
   * Draws raw image in mirror canvas. Mirror is used for output.
   */
  this.loadMirror = () => {
    this.mirror.width = this.image.width;
    this.mirror.height = this.image.height;
    this.mirrorContext.drawImage(this.image, 0, 0);
  }

  /**
   * Crops image based on selector size & position relative to image location within canvas.
   * The output is generated from the mirror canvas based on scaled selector dimensions.
   */
  this.crop = () => {
    const maxSelectedWidth = this.canvas.width - this.margins.left * 2;
    const maxSelectedHeight = this.canvas.height - this.margins.top * 2;
    let selectedX = this.selector.offsetLeft - this.margins.left;
    let selectedY = this.selector.offsetTop - this.margins.top;
    let selectedWidth = this.selector.offsetWidth;
    let selectedHeight = this.selector.offsetHeight;
    if (selectedX < 0) {
      selectedWidth += selectedX;
      selectedX = 0;
    }
    if (selectedY < 0) {
      selectedHeight += selectedY;
      selectedY = 0;
    }
    if (selectedX + selectedWidth > maxSelectedWidth) {
      selectedWidth = maxSelectedWidth - selectedX;
    }
    if (selectedY + selectedHeight > maxSelectedHeight) {
      selectedHeight = maxSelectedHeight - selectedY;
    }
    const ICRatio = this.image.width / (this.canvas.width - this.margins.left * 2);
    selectedX = ICRatio * selectedX;
    selectedY = ICRatio * selectedY;
    selectedWidth = ICRatio * selectedWidth;
    selectedHeight = ICRatio * selectedHeight;
    const { width, height } = this.fit({ width: selectedWidth, height: selectedHeight });
    this.mirror.width = width;
    this.mirror.height = height;
    this.mirrorContext.drawImage(this.image, selectedX, selectedY, selectedWidth, selectedHeight, 0, 0, width, height);
    this.mirror.toBlob(handleBlob, 'image/png', 1);
  }

  /**
   * Rotates image in increments of 90 degrees.
   *
   * @param {integer} rotation Clockwise rotation for positive numbers. Counterclockwise for negative numbers.
   */
  this.rotate = (rotation) => {
    rotation %= 4;
    if (rotation % 2) {
      this.mirror.width = this.image.height;
      this.mirror.height = this.image.width;
    }
    else {
      this.mirror.width = this.image.width;
      this.mirror.height = this.image.height;
    }
    this.mirrorContext.translate(this.mirror.width / 2, this.mirror.height / 2);
    this.mirrorContext.rotate(90 * rotation * Math.PI / 180);
    this.mirrorContext.translate(-this.image.width / 2, -this.image.height / 2);
    this.mirrorContext.drawImage(this.image, 0, 0);
    this.mirror.toBlob(handleBlob, 'image/png', 1);
  }

  /**
   * Resets selector size & position based on optional initial dimensions.
   * If no initial data is provided selector will be centered within the canvas.
   */
  this.resetSelector = () => {
    this.selector.style.width = (options.selector.initial?.width || this.canvas.width / 2) + 'px';
    this.selector.style.height = (options.selector.initial?.height || this.canvas.height / 2) + 'px';
    this.selector.style.left = (options.selector.initial?.left || this.canvas.offsetLeft + this.canvas.width / 4) + 'px';
    this.selector.style.top = (options.selector.initial?.top || this.canvas.offsetTop + this.canvas.height / 4) + 'px';
  }

  /**
   * Reload input image and reset selector.
   */
  this.reset = () => {
    if (options.canvas.image) {
      this.image = options.canvas.image;
      this.loadImage();
      this.loadMirror();
    }
    else if (options.canvas.imgSrc) {
      this.image = new Image();
      this.image.onload = () => {
        this.loadImage();
        this.loadMirror();
      }
      this.image.src = options.canvas.imgSrc;
    }
    else {
      console.warn('cropper:no_image_provided');
    }
    this.resetSelector();
  }

  /**
   * Runs document.getElementById and builds a tree structure of elements based on the tree structure of the provided list.
   *
   * @param {Object} list Input tree structure of ids.
   * @param {Object} target Output object to store the resulting DOM elements.
   * Ids are suffixed with uniqueId if no target is provided.
   */
  const parseIds = (list, target) => {
    for (let item in list) {
      if (typeof list[item] === 'object') {
        if (target) {
          target[item] = {}
        }
        parseIds(list[item], target?.[item]);
        continue;
      }
      if (!target) {
        list[item] += `-${options.uniqueId}`;
      }
      else {
        target[item] = document.getElementById(list[item]);
      }
    }
  }

  /**
   * Returns key up handler for given list of keys that runs given action if any of the keys are pressed.
   *
   * @param {array} keys Array of keys that will trigger given action.
   * @param {function} action Function to run if any of the given keys is pressed.
   * Ids are suffixed with uniqueId if no target is provided.
   */
  const onKeyUp = (keys, action) => {
    return (event) => {
      if (keys.indexOf(event.keyCode) !== -1) {
        action();
      }
    }
  }

  /**
   * Creates cropper instance data structure, injects HTML in container and starts image loading.
   */
  this.initialize = () => {
    this.ids = {
      canvas: 'cropper-canvas',
      selector: 'cropper-selector',
      sections: {
        tools: 'cropper-tools',
        crop: 'cropper-crop-decision'
      },
      buttons: {
        rotateLeft: 'cropper-button-rotate-left',
        rotateRight: 'cropper-button-rotate-right',
        crop: 'cropper-button-crop',
        confirmCrop: 'cropper-button-confirm',
        cancelCrop: 'cropper-button-cancel'
      },
      handles: {
        top_left: 'cropper-handle-top-left',
        top: 'cropper-handle-top',
        top_right: 'cropper-handle-top-right',
        left: 'cropper-handle-left',
        right: 'cropper-handle-right',
        bottom_left: 'cropper-handle-bottom-left',
        bottom: 'cropper-handle-bottom',
        bottom_right: 'cropper-handle-bottom-right'
      },
      masks: {
        top: 'cropper-mask-top',
        right: 'cropper-mask-right',
        bottom: 'cropper-mask-bottom',
        left: 'cropper-mask-left'
      }
    }
    parseIds(this.ids);
    this.container.innerHTML =
    `<div class="cropper-buttons">
      <div class="cropper-inline" id="${this.ids.sections.tools}">
        <div class="cropper-button cropper-image-button" id="${this.ids.buttons.rotateLeft}" tabindex=0 aria-label="${options.labels.rotateLeft}">
          <div class="cropper-icon cropper-rotate-left"></div>
        </div>
        <div class="cropper-button cropper-image-button" id="${this.ids.buttons.rotateRight}" tabindex=0 aria-label="${options.labels.rotateRight}">
          <div class="cropper-icon cropper-rotate-right"></div>
        </div>
        <div class="cropper-button cropper-image-button" id="${this.ids.buttons.crop}" tabindex=0 aria-label="${options.labels.cropImage}">
          <div class="cropper-icon cropper-crop"></div>
        </div>
      </div>
      <div class="cropper-hidden" id="${this.ids.sections.crop}">
        <div class="cropper-button" id="${this.ids.buttons.confirmCrop}" tabindex=0 aria-label="${options.labels.confirmCrop}">
          <div class="cropper-icon cropper-confirm"></div>
          <div class="cropper-icon cropper-confirm-text">${options.labels.confirmCrop}</div>
        </div>
        <div class="cropper-button" id="${this.ids.buttons.cancelCrop}" tabindex=0 aria-label="${options.labels.cancelCrop}">
          <div class="cropper-icon cropper-cancel"></div>
          <div class="cropper-icon cropper-cancel-text">${options.labels.cancelCrop}</div>
        </div>
      </div>
    </div>
    <div class="cropper-canvas-container">
      <canvas id="${this.ids.canvas}"></canvas>
      <div class="cropper-mask" id="${this.ids.masks.top}"></div>
      <div class="cropper-mask" id="${this.ids.masks.right}"></div>
      <div class="cropper-mask" id="${this.ids.masks.bottom}"></div>
      <div class="cropper-mask" id="${this.ids.masks.left}"></div>
      <div id="${this.ids.selector}" class="cropper-selector">
        <div class="cropper-selector-border">
          <div class="cropper-border-top-left"></div><div class="cropper-border-top"></div><div class="cropper-border-top-right"></div>
          <div class="cropper-border-center-left"></div><div class="cropper-border-center"></div><div class="cropper-border-center-right"></div>
          <div class="cropper-border-bottom-left"></div><div class="cropper-border-bottom"></div><div class="cropper-border-bottom-right"></div>
        </div>
        <div id="${this.ids.handles.top_left}" class="cropper-handle cropper-top-left"></div>
        <div id="${this.ids.handles.top}" class="cropper-handle cropper-top"></div>
        <div id="${this.ids.handles.top_right}" class="cropper-handle cropper-top-right"></div>
        <div id="${this.ids.handles.left}" class="cropper-handle cropper-left"></div>
        <div id="${this.ids.handles.right}" class="cropper-handle cropper-right"></div>
        <div id="${this.ids.handles.bottom_left}" class="cropper-handle cropper-bottom-left"></div>
        <div id="${this.ids.handles.bottom}" class="cropper-handle cropper-bottom"></div>
        <div id="${this.ids.handles.bottom_right}" class="cropper-handle cropper-bottom-right"></div>
      </div>
    </div>`;
    parseIds(this.ids, this);
    this.margins = {
      left: 0,
      top: 0
    }
    this.canvas.width = options.canvas.width;
    this.canvas.height = options.canvas.height;
    this.context = this.canvas.getContext('2d');
    this.mirror = document.createElement('canvas');
    this.mirrorContext = this.mirror.getContext('2d');
    this.pointerOffset = {};

    // button click handlers
    this.buttons.rotateLeft.onclick = () => this.rotate(-1);
    this.buttons.rotateRight.onclick = () => this.rotate(1);
    this.buttons.crop.onclick = () => {
      this.toggleSection('crop');
      this.toggleSelector(true);
    }
    this.buttons.confirmCrop.onclick = () => {
      this.crop();
      this.toggleSection('tools');
      this.toggleSelector(false);
    }
    this.buttons.cancelCrop.onclick = () => {
      this.toggleSection('tools');
      this.toggleSelector(false);
    }

    // button keyUp handlers
    for (let item in this.buttons) {
      const button = this.buttons[item];
      if (typeof button.onclick === 'function' && button.getAttribute('tabindex') == 0) {
        button.onkeyup = onKeyUp([13, 32], button.onclick);
      }
    }
  }

  this.initialize();
  this.reset();
  handleMove();
  for (let item in this.handles) {
    handleResize(item);
  }
}
