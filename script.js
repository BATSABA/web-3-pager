console.log('script.js initialized');

document.getElementById('address').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        document.querySelector('h1').classList.add('hidden');
        document.querySelector('.input-row').classList.add('input-moved');
        loadContent();
    }
});

async function loadContent() {
    const address = document.getElementById('address').value.trim();
    const contentDiv = document.getElementById('content');

    if (!address) {
        contentDiv.innerHTML = '<p>Please enter a valid address.</p>';
        return;
    }

    contentDiv.innerHTML = '<p>Loading...</p>';

    try {
        const apiUrl = `https://fullnode.devnet.aptoslabs.com/v1/accounts/${address}/resource/${address}::WebPageStore::WebPage`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (!data || !data.data) {
            throw new Error('Invalid response structure');
        }

        const html = data.data.html || '';
        const css = data.data.css || '';
        let js = data.data.js || '';

        console.log('Received JS:', js);

        const scopedCss = `#content { ${css} }`;

        const style = document.createElement('style');
        style.textContent = scopedCss;
        document.body.appendChild(style);
        console.log('Scoped CSS appended');

        contentDiv.innerHTML = html;
        console.log('HTML rendered');

        if (js.includes('window.onload')) {
            js = js.replace('window.onload = () => {', '').replace(/};\s*$/, '');
        }

        const script = document.createElement('script');
        script.textContent = `
            try {
                ${js}
                console.log("Script executed directly");
            } catch (e) {
                console.error("Execution error:", e);
            }
        `;
        script.onerror = (e) => console.error('Script execution error:', e);
        contentDiv.appendChild(script);
        console.log('Script appended to contentDiv');


    } catch (error) {
        console.error('Error fetching data:', error.message);
        contentDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}
