
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
        this.container = this.shadowRoot.querySelector('.notifications-container');
        this.closeBtn = this.shadowRoot.querySelector('.closePopups');
        this.closeBtn.addEventListener('click', e => {
          this.closePopups();
        });

        //this.shadowRoot.querySelector('.btn-create-ws').addEventListener('click', e => {this.createWorkspace()});
    }

      loadCss(path) {
          fetch(`http://localhost:5000/static/components/check-notifications/styles.css`)
          .then(response => response.text())
              .then(data => {
                  let node = document.createElement('style');
                  node.innerHTML = data;
                this.shadowRoot.appendChild(node);
                //this.calculateWorkspaceWidth();
              });
      }
    connectedCallback() {
        // intialize start state
        this.classList.add('hidden');
    }

    disconnectedCallback() {

    }

    animateNotifications() {
        console.log("animation notis");
        this.classList.remove('hidden');
        this.classList.add('visible');

        this.container.classList.add('popTransition');
    }

    closePopups() {
      this.classList.remove('visible');
      this.classList.add('hidden');
      this.container.classList.remove('popTransition');
    }

    /*createWorkspace() {
        this.classList.remove('visible');
        this.classList.add('hidden');
        this.container.classList.remove('popTransition');

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
    }*/
  }

window.customElements.define('check-notifications', Workspace);
