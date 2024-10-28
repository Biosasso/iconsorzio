import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    // static async getInitialProps(ctx) {
    //     const initialProps = await Document.getInitialProps(ctx)
    //     return { ...initialProps }
    // }

    render() {
        return (
            <Html lang="it" className="h-full bg-white">
                <Head>
                    {/* Indigo 500 Color */}
                    <meta name="theme-color" content="#6366f1" />
                </Head>
                <body className="h-full overflow-hidden">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument