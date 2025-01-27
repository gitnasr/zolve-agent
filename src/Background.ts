import { clipboard } from '@extend-chrome/clipboard'

function polling() {
    console.log("polling");
    setTimeout(polling, 1000 * 30);
  }
  
  polling();
