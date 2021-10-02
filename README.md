# stx.me

Creators all over the web have been using services like [Buy Me a Coffee](https://www.buymeacoffee.com/) to easily accept donations from their supports. What if creators could easily accept STX donations? That's exactly what stx.me aims to achieve!

Accept STX donations from any website by simply adding a `<script>`.

## Getting Started

1. Add the stx.me container to your webpage

```html
<div id="stx-me"></div>
```

2. Add the stx.me script to your webpage

```html
<script src="https://unpkg.com/stx-me/dist/stx.me.js"></script>
```

3. Initialize stx.me with your wallet address


```html
<script>
    stx.me('SP2D71SFBCAX1VE664GKQP2Y7YMRDW6YJGVQVXB1T');
</script>
```

4. Add stx.me stylesheet (optional)

```html
<link rel="stylesheet" href="https://unpkg.com/stx-me/dist/stx.me.css"></link>
```

## Configuration

The stx.me function takes a second, optional parameter of options. The following options are allowed:

```typescript
interface AppDetails {
  name: string;
  icon: string;
}

interface ConfigOptions {
  showAddress?: boolean;
  appDetails?: AppDetails;
  successMessage?: string;
  buttonText?: string;
}
```

### AppDetails

Used to configure what users will see witihin the Stacks wallet.

| Parameter | Default        | Description                                          |
| --------- | -------------- | ---------------------------------------------------- |
| name      | document.title | An app name to display in the Stacks wallet.         |
| icon      | /favicon.ico   | The path to an icon to display in the Stacks wallet. |

### ConfigOptions

Used to configure how the stx.me button behaves.

| Parameter      | Default                   | Description                                           |
| -------------- | ------------------------- | ----------------------------------------------------- |
| showAddress    | false                     | Display your stacks address on your webpage.          |
| appDetails     | See AppDetails            | Configuration for the Stacks wallet pop ups.          |
| successMessage | Thanks for your donation! | A message to display to users on successful donation. |
| buttonText     | Send Me STX               | A message to display on the donation button.          |
| network        | mainnet                   | The Stacks network transactions should be sent on.    |
