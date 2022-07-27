import alt, { WebView } from 'alt-client'

export class WebView2DContainer {
    webView: WebView

    constructor(webView: WebView) {
        this.webView = webView
    }

    releaseToPool() {
        if(WebView2DPool.availableObjectCount < WebView2DPool.MAX_SIZE) {
            this.webView.url = 'resource/client/webviews/blank.html'

            WebView2DPool.webViews[WebView2DPool.availableObjectCount++] = this
        }
    }
}

export default class WebView2DPool {
    static INITIAL_SIZE = 4
    static MAX_SIZE = 8

    static webViews: WebView2DContainer[]

    static availableObjectCount = 0

    static initialize() {
        WebView2DPool.webViews = []

        let i = 0

        const webViewIntializingInterval = alt.setInterval(() => {
            if(i >= WebView2DPool.INITIAL_SIZE) {
                alt.clearInterval(webViewIntializingInterval)
            } else {
                WebView2DPool.webViews[i] = new WebView2DContainer(
                    new WebView('resource/client/webviews/blank.html')
                )

                WebView2DPool.availableObjectCount++
            }

            i++
        }, 50)
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