function Cropper(options) {
  this.options = options;
  this.selector = document.getElementById(options.selector.id);
  this.canvas = document.getElementById(options.canvas.id);
  this.handles = {
    tl: document.getElementById(options.selector.handles.tl),
    t: document.getElementById(options.selector.handles.t),
    tr: document.getElementById(options.selector.handles.tr),
    l: document.getElementById(options.selector.handles.l),
    r: document.getElementById(options.selector.handles.r),
    bl: document.getElementById(options.selector.handles.bl),
    b: document.getElementById(options.selector.handles.b),
    br: document.getElementById(options.selector.handles.br)
  }
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
  const handleMove = () => {
    const onPointerDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.pointerOffset.x = event.clientX - this.selector.offsetLeft;
      this.pointerOffset.y = event.clientY - this.selector.offsetTop;
      this.pointerOffset.xSpan = this.selector.offsetLeft + this.selector.offsetWidth;
      this.pointerOffset.ySpan = this.selector.offsetTop + this.selector.offsetHeight;
      this.toggleHandles(false);
      window.onpointerup = onPointerUp;
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
    }
    const onPointerUp = (event) => {
      event.preventDefault();
      event.stopPropagation();
      window.onpointerup = undefined;
      window.onpointermove = undefined;
      this.toggleHandles(true);
    }
    this.selector.onpointerdown = onPointerDown;
  }
  const handleResize = (type) => {
    if (!this.handles[type]) {
      return;
    }
    const onPointerDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.pointerOffset.xSpan = this.selector.offsetLeft + this.selector.offsetWidth - options.selector.min.width;
      this.pointerOffset.ySpan = this.selector.offsetTop + this.selector.offsetHeight - options.selector.min.height;
      this.toggleHandles(false, type);
      window.onpointerup = onPointerUp;
      window.onpointermove = onPointerMove;
    }
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
        t: false,
        l: false,
        b: false,
        r: false
      }
      for (let item of type) {
        map[item] = true;
      }
      handleAll(map.t, map.l, map.b, map.r);
    }
    const onPointerUp = (event) => {
      event.preventDefault();
      event.stopPropagation();
      window.onpointerup = undefined;
      window.onpointermove = undefined;
      this.toggleHandles(true, type);
    }
    this.handles[type].onpointerdown = onPointerDown;
  }
  const handleBlob = (blob) => {
    const url = URL.createObjectURL(blob);
    this.image = new Image();
    this.image.onload = () => {
      URL.revokeObjectURL(url);
      this.loadImage();
    }
    this.image.src = url;
  }
  this.toggleHandles = (on, except) => {
    for (let item in this.handles) {
      if (item === except) {
        continue;
      }
      this.handles[item].style.opacity = on ? 1 : 0;
    }
  }
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
  this.loadImage = () => {
    const { width, height } = this.fit(this.image);
    this.margins.left = (this.canvas.width - width) / 2;
    this.margins.top = (this.canvas.height - height) / 2;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.drawImage(this.image, this.margins.left, this.margins.top, width, height);
    this.resetSelector();
    this.image.onload = undefined;
  }
  this.loadMirror = () => {
    this.mirror.width = this.image.width;
    this.mirror.height = this.image.height;
    this.mirrorContext.drawImage(this.image, 0, 0);
  }
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
    let sx = ICRatio * selectedX;
    let sy = ICRatio * selectedY;
    let sw = ICRatio * selectedWidth;
    let sh = ICRatio * selectedHeight;
    const { width, height } = this.fit({ width: sw, height: sh });
    this.mirror.width = width;
    this.mirror.height = height;
    this.mirrorContext.drawImage(this.image, sx, sy, sw, sh, 0, 0, width, height);
    this.mirror.toBlob(handleBlob, 'image/png', 1);
  }
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
  this.resetSelector = () => {
    this.selector.style.width = this.canvas.width / 2;
    this.selector.style.height = this.canvas.height / 2;
    this.selector.style.left = this.canvas.offsetLeft + this.canvas.width / 4;
    this.selector.style.top = this.canvas.offsetTop + this.canvas.height / 4;
  }
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
      console.log('no image provided');
    }
  }
  this.reset();
  handleMove();
  for (let item in this.handles) {
    handleResize(item);
  }
}
