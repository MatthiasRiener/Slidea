
 import { template } from './template.js';

  class Workspace extends HTMLElement {
    constructor() {
      super();

      this.temp = document.createElement('template');
      this.temp.innerHTML = template;


        this.attachShadow({
        mode: 'open'
      });

        this.shadowRoot.appendChild(this.temp.content.cloneNode(true));
        this.loadCss(this.getAttribute("path"));
        this.container = this.shadowRoot.querySelector('.workspace-container');

        this.shadowRoot.querySelector('.btn-create-ws').addEventListener('click', e => {this.createWorkspace()});

        this.shadowRoot.querySelector('#background-workspace-container').addEventListener('click', e => {this.closeWorkspace()})
      }

      loadCss(path) {
          fetch(`${baseURL}/static/components/create-workspace/styles.css`)
          .then(response => response.text())
              .then(data => {
                  let node = document.createElement('style');
                  node.innerHTML = data;
                this.shadowRoot.appendChild(node);
                this.calculateWorkspaceWidth();
              });
      }
    connectedCallback() {
        // intialize start state
        this.classList.add('hidden');
    }



      calculateWorkspaceWidth() {
        var workSpace = this.shadowRoot.querySelector('.workplace-picture');
        workSpace.style.height = `${workSpace.getBoundingClientRect().width}px`;
      }

    disconnectedCallback() {

    }
    animateWorkspace() {
        this.classList.remove('hidden');
        this.classList.add('visible');

        this.container.classList.add('popTransition');

    }

    closeWorkspace() {
        this.classList.remove('visible');
        this.classList.add('hidden');
        this.container.classList.remove('popTransition');
    }

    createWorkspace() {
        this.closeWorkspace();

        let workspaceName = this.shadowRoot.querySelector('#workspaceName').value;
        let workspaceUsers = this.shadowRoot.querySelector('#workspaceUsers').value.split(';');

        let workspace = {
          name: workspaceName,
          users: workspaceUsers,
          image: 'https://www.ruhr24.de/bilder/2020/01/30/13511554/547564660-haben-macher-die-simpsons-coronavirus-schon-vorhergesehen-Mn1zvMk6Lec.jpg'
        }

        sendRequestToServer({type: "POST", url: "/workspace/createWorkspace", data: workspace}).then(data => {
          $('#workspaceCount').text(data.workspaces);
        });
    }
  }

window.customElements.define('create-workspace', Workspace);
