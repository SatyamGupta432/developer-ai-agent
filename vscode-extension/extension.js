const vscode = require('vscode');
const http = require('http');

function activate(context) {
    let disposable = vscode.commands.registerCommand('ai-agent-docs.analyze', function () {
        vscode.window.showInformationMessage('🚀 Triggering AI Documentation analysis...');
        
        http.get('http://localhost:8000/analyze', (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                const response = JSON.parse(data);
                if (response.documentation) {
                    vscode.window.showInformationMessage('✅ Documentation generated successfully!');
                    // Optionally open the markdown file
                    if (response.markdown) {
                        const filePath = vscode.Uri.file(context.extensionPath + '/../backend/' + response.markdown);
                        // Note: This path might need adjustment based on where the extension is running
                    }
                } else {
                    vscode.window.showErrorMessage('❌ Analysis failed: ' + (response.error || 'Unknown error'));
                }
            });
        }).on("error", (err) => {
            vscode.window.showErrorMessage("❌ Error: " + err.message + ". Is the backend running?");
        });
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}
