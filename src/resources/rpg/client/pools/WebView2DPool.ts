import { WebView } from 'alt-client'

export class WebView2DContainer {
    webView: WebView

    constructor(webView: WebView) {
        this.webView = webView
    }

    releaseToPool() {
        if(WebView2DPool.availableObjectCount < WebView2DPool.MAX_SIZE) {
            this.webView.url = ''

            WebView2DPool.webViews[WebView2DPool.availableObjectCount++] = this
        }
    }
}

export default class WebView2DPool {
    static INITIAL_SIZE = 4
    static MAX_SIZE = 8

    static webViews: Array<WebView2DContainer>

    static availableObjectCount = 0

    static {
        WebView2DPool.webViews = new Array(WebView2DPool.INITIAL_SIZE)

        for(let i = 0; i < WebView2DPool.INITIAL_SIZE; i++) {
            WebView2DPool.webViews[i] = new WebView2DContainer(new WebView(''))

            ++WebView2DPool.availableObjectCount
        }
    }

    static requestObject(url: string): WebView2DContainer {
        if(WebView2DPool.availableObjectCount > 0) {
            const availableObject = WebView2DPool.webViews[--WebView2DPool.availableObjectCount]

            availableObject.webView.url = url

            return availableObject
        } else {
            return new WebView2DContainer(new WebView(url))
        }
    }
}