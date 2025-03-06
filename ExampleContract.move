module address::WebPageStore { //change address into real address like 0xA123...
    use std::signer;
    use std::string::{Self, String};

    struct WebPage has key {
        html: String,
        css: String,
        js: String,
        version: u64,
        owner: address
    }

    public entry fun initialize(account: &signer) {
        let owner_address = signer::address_of(account);
        let webpage = WebPage {
            html: string::utf8(b"<h1>Welcome to Aptos Web!</h1>"),
            css: string::utf8(b"body { background-color: #f0f0f0; } h1 { color: blue; }"),
            js: string::utf8(b"console.log('Hello from Aptos!');"),
            version: 0,
            owner: owner_address
        };
        move_to(account, webpage);
    }

    public entry fun update_webpage(
        account: &signer,
        new_html: String,
        new_css: String,
        new_js: String
    ) acquires WebPage {
        let owner_address = signer::address_of(account);
        let webpage = borrow_global_mut<WebPage>(owner_address);
        assert!(webpage.owner == owner_address, 1001);

        webpage.html = new_html;
        webpage.css = new_css;
        webpage.js = new_js;
        webpage.version = webpage.version + 1;
    }

    public fun get_html(addr: address): String acquires WebPage {
        let webpage = borrow_global<WebPage>(addr);
        webpage.html
    }

    public fun get_css(addr: address): String acquires WebPage {
        let webpage = borrow_global<WebPage>(addr);
        webpage.css
    }

    public fun get_js(addr: address): String acquires WebPage {
        let webpage = borrow_global<WebPage>(addr);
        webpage.js
    }

    public fun get_version(addr: address): u64 acquires WebPage {
        let webpage = borrow_global<WebPage>(addr);
        webpage.version
    }
}
