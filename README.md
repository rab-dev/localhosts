---
title: Welcome
---

# Welcome to Localhosts

> Localhosts Proxy Server with Dynamic Routing

## Motivation:

Developers sometimes edit the `HOSTS` file to map a custom domain name to the 
`localhost` server running on port `80`.

This is done so the developer can use the custom domain name (e.g. `app.example.com`)
and requests will be resolved to the server running on localhost.

Trying to do this with multiple domains causes a problem as all domains are resolved
to the same server (i.e. `localhost:80`).

## Concept:

Create a server on `localhost:80` that proxies requests to other localhost servers
based on the value of the host header.

Use a `localhosts` file for developers to define where each host should be proxied.

The `localhosts` file is, in effect, a reverse version of the well-known `hosts` file.

## Solution:

Localhosts run a dynamic HTTP proxy server that routes incoming HTTP requests 
to different localhost servers based on the host header in the request and can
adapt to changes in the routing configuration without the need to restart the 
server.

> For example, it may route `www.example.com` to `localhost:8081`.

The mapping between host headers and port numbers is defined in a file called
`localhosts` which is automatically reloaded when changes are detected to the file.

> app.example.com 8081
> www.example.com 8082

## Features:

  * Proxies requests to localhost servers based on hostnames.
  * Monitors changes to the 'localhosts' file for dynamic configuration updates.
  * Handles unknown hosts and missing target ports gracefully.

## Usage

To install:

```
# clone the git repository
git clone git@github.com:rab-dev/localhosts.git
npm install
```

To run:

```
cd localhosts
node localhosts.mjs
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