# Welcome to Localhosts

Map requests from custom domains to local servers.

## Motivation:

Developers often treat the standard well-known `HOSTS` file as a local
`DNS` to map their custom domains to localhost.

They do this so they can reference local apps using a custom domain name
(e.g. `app.example.com`) instead of a port number (e.g. `localhost:8081`).

Requests sent to th custom domain will be resolved by the operating system
to the default server running on their local machine.

Doing this for multiple custom domains causes a problem as all requests for
all apps are then resolved to the same server (i.e. `localhost:80`).

## Concept:

Create a default local server on `localhost` that proxies requests to other local
servers based on the value of the custom domain host header.

In effect, provide a reverse version of the well-known `HOSTS` file.
Instead of mapping custom domain to `IP Address`, map custom domain to 
a localhost `PORT`.

## Solution:

This app runs a dynamic HTTP proxy server that proxies incoming HTTP requests 
to different local servers based on the host header in the request.

The app can adapt to changes in the routing configuration without the 
need to restart the server.

> For example, it may route `www.example.com` to `localhost:8081`.

The mapping between host headers and port numbers is defined in a file called
`localhosts.txt` which is automatically reloaded when changes are detected to the file.

> app.example.com 8081
> www.example.com 8082

## Features:

  * Proxies requests to localhost servers based on hostnames.
  * Monitors changes to the `LOCALHOSTS` file for dynamic configuration updates.
  * Handles unknown hosts and missing target ports gracefully.

## Usage

To install:

```
git clone git@github.com:rab-dev/localhosts.git
npm install
```

To run:

```
cd localhosts
node localhosts.mjs
(or sudo node localhosts.js)
```

To configure:

```
edit localhosts.txt
```

To test:

```
curl --verbose -H "Host: www.example.com" http://localhost
```

---

## Feedback

Please use this repository to provide feedback and/or raise issues
or feature requests.

Alternatively we can connect on twitter @rabthings.

---

