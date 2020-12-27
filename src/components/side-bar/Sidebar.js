
 import { template } from './template.js';

  class Sidebar extends HTMLElement {
    constructor() {
      super();

      this.temp = document.createElement('template');
      this.temp.innerHTML = template;


        this.attachShadow({
        mode: 'open'
      });

        this.shadowRoot.appendChild(this.temp.content.cloneNode(true));
        this.loadCss("styles.css");
        this.container = this.shadowRoot.querySelector('.left-side-bar');

    }

      loadCss(path) {
          fetch(path)
          .then(response => response.text())
              .then(data => {
                  let node = document.createElement('style');
                  node.innerHTML = data;
                this.shadowRoot.appendChild(node);
                this.calculateWorkspaceWidth();
              });
      }
    connectedCallback() {

        this.container.style.width = `${this.getAttribute("width")}%`;
        this.container.style.height = `${this.getAttribute("height")}%`;
    }


      calculateWorkspaceWidth() {
        var workSpace = this.shadowRoot.querySelector('.cur-workspace');
        workSpace.style.width = `${workSpace.getBoundingClientRect().height}px`;
      }

    disconnectedCallback() {

    }
  }

window.customElements.define('side-bar', Sidebar);
