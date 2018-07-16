# RaiseTheApp

## Description
RaiseTheApp is a configurable notification system that can be integrated as a module in a Vue.js web application.

## Run and build

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production as Vue.js module
npm run build

# run all tests
npm test
```

---

## Use as a Vue.js module

### Add dependencies
Add as npm module in `package.json`, either as path to folder or to git repo.

Note that the repo/path must have a valid `package.json` in the root.
```js
// ...
"raisetheapp": "<repo_url.git> | file:<path to folder>",
// ...
```
Note: if the path is a git repository, the `dist` folder (i.e. the build output) must be committed.

#### External dependencies (i.e. not bundled in the module)
- Vue
- Vuex
- font-awesome

#### Import RaiseTheApp Vue.js component
```js
import RaiseTheApp from 'raisetheapp';
// ...
// in HTML
<raise-the-app :server-url="..."></raise-the-app>
// ...
// Inside component definition:
components: { /* <other child components>, */ RaiseTheApp }
// ...
```

#### Import RaiseTheApp Vuex store
```js
import { raiseTheAppStore } from 'raisetheapp';

store.registerModule('raiseTheApp', raiseTheAppStore);
```
Where `store` is the existing Vuex store, otherwise create a new one.
This will add the store as a module to the existing one.

#### Import styling
```js
import 'raisetheapp/dist/lib/static/app.min.css';
```
(needs `webpack` with `css-loader`)


---

## API

### EventSource docs
https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events

https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events

https://developer.mozilla.org/en-US/docs/Web/API/EventSource


### Setup Server for event streams
The client will subscribe to an event stream through a GET request when `EventSource` is instantiated.

Example request:
`GET <server-url:port>/subscribe`.

#### Setup server URL
The server URL must be setup by passing it as the `server-url` prop when declaring the Vue.js component in the HTML.
```html
<raise-the-app :server-url="http://..."></raise-the-app>
```
<!-- Add the server URL as an environment variable (`SERVER_URL`)
in `config/dev.env.js` or `config/prod.env.js` -->

#### Server response headers
```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

#### Server response body
[Event stream format](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format)
```
<field>:<value>\n
<field>:<value>\n
<field2>:<value>\n\n
```

Example response
```
event: notify\n
id: 123\n
data: { "title": "Notification Title",
  "text": "Lorem ipsum.",
  "priority": 2,
  "id": "1345f488-5aaa-4c4b-9076-f3eb12905556",
  "unread": true,
  "time": "Fri, 15 Dec 2017 08:53:12 GMT" }\n\n
```

The connection is kept open, and new events should be sent
to the same connection using the specified format.

### Possible additional requirements for older browsers
See [EventSource polyfill docs](https://github.com/Yaffle/EventSource#server-side-requirements)

### Notification format
```js
{
  "title": "Notification Title",
  "text": "Notification text content",
  "priority": 2, // priority level of the notification
  "id": "unique ID",
  "unread": true,
  "time": "Fri, 15 Dec 2017 08:53:12 GMT",
  "type": "broadcast" // OPTIONAL
}
```
All fields are mandatory, except for the type .
The `text` field can contain html tags and they will be rendered (e.g. links). Be aware that this may be unsafe if the notification contents are user generated.


### Notification read/delete requests
#### Set a single notification as read (happens when clicking the checkmark button)
```
POST <server-url:port>/notifications/:notification-id/read
```
Client expects just a `status: 200` if succeeded.

#### Delete a notification (happens when clicking the "trash" button)
```
POST <server-url:port>/notifications/:notification-id/delete
```
Client expects just a `status: 200` if succeeded.

#### Set all unread notifications as read
```
POST <server-url:port>/notifications/readAll
```
Client expects just a `status: 200` if succeeded.

#### Delete all notifications
```
POST <server-url:port>/notifications/deleteAll
```
Client expects just a `status: 200` if succeeded.

#### Optional query params
If needed, additional params can be configured to be sent with the read/delete requests.
Note that the parameter names must be fields of the `Notification` interface (see `src/lib/Notification.ts`). These are used if, for some reason, the server needs additional information regarding the affected notification.

---

## Usage of event streams
### Adding new event-stream listeners
Example
```js
let connection: SSEConnection = new SSEConnection(`<stream_url>`);

connection.on(`<event_name>`, (evt: SSEEvent) => {
  let data = JSON.parse(evt.data);
  let id = JSON.parse(evt.id);
  // ...
});
```
Where `connection` must be of type `SSEConnection`, and `<event_name>` corresponds to the event type defined inside the stream response body.
For more features see the `SSEConnection.ts` class.

---

## Configuration and theming
### Config file
`src/config/config.json` example
```js
{
  // Priority levels
  // "priority" field inside notification selects the
  "levels" : [
    {
      "icon" : "fa-envelope-o", // must be a font-awesome icon name
      "color" : "#4CAF50",
      "backgroundColor" : "#C8E6C9",
      "hoverColor" : "#E8F5E9"
    },
    // ...
  ],

  // Show unread/important text on top of notification list
  // e.g. "3 unread notifications (1 important)
  "showUnreadText" : false,

  // Length of notification text excerpt when
  // notification is not expanded.
  "excerptSize": 50,

  // Change notification icon background color
  // depending on the highest-priority unread notification's
  "dynamicIconColor": false,

  // Set-up query parameters for read/delete notification requests
  // Note: they both are _optional_.
  // "readParams": ["type"],
  // "deleteParams": ["type"]
}
```
Configuration can be overridden at runtime by passing
a new json (with the same format) as a prop into the component:
```html
<raise-the-app :server-url="http://..." :config="newConfig"></raise-the-app>
```

### Style
Edit `.scss` files in `src/theme` folder, where there's a file for each component.


---


## Open Issues
### Configuration and theming
The main theming issue is styling notifications based on their priority.
Right now, the priority-specific style is defined inside the `src/config/config.json` file, since the number of priority levels is not fixed, and the JS code has to know it.

One possible rework is to only theme using `*.scss` files, and for each notification priority level we add a class with a name such as `notification-X`, where `X` is the priority level.
In that case, the number of classes must be defined somewhere also in the config.

### TypeScript configuration
Right now TypeScript's strict mode (`"strict"` flag in `tsconfig.json`) is disabled due to issues with Vue types (fields such as props or data are not recognized as part of the Vue component).

However this can probably be fixed by using a different Vue component syntax (i.e [vue-class-component](https://github.com/vuejs/vue-class-component)).


## License
Copyright 2018 ExMachina SAGL (http://www.exmachina.ch)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

