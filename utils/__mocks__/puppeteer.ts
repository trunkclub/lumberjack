// https://javascriptwebscrapingguy.com/jordan-mocks-puppeteer-with-jest/

import {
  Browser as BrowserT,
  Page as PageT,
  ElementHandle as ElementHandleT,
  Puppeteer as PuppeteerT
} from 'puppeteer'

export const ElementHandle = {
  $eval() {
    return Promise.resolve()
  },
} as unknown as ElementHandleT

export const Page = {
  close() {
    return Promise.resolve()
  },
  evaluate() {
    return Promise.resolve()
  },
  goto(url: string) {
    return Promise.resolve()
  },
  setBypassCSP() {
    return Promise.resolve()
  },
  setViewport() {
    return Promise.resolve()
  },
  waitForNetworkIdle() {
    return Promise.resolve()
  },
  $$(selector: string): Promise<ElementHandleT[]> {
    return Promise.resolve([]);
  },
  $(selector: string) {
    return Promise.resolve(ElementHandle);
  },
  $eval(selector: string, pageFunction: any) {
    return Promise.resolve('Mocked text content.')
  },
} as unknown as PageT

export const Browser = {
  close() {
    return Promise.resolve()
  },
  newPage() {
    return Promise.resolve(Page)
  },
} as unknown as BrowserT

const Puppeteer = {
  launch() {
    return Promise.resolve(Browser)
  },
} as unknown as PuppeteerT

export default Puppeteer
