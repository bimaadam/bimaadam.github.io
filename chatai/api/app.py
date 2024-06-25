from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/query', methods=['POST'])
def query():
    data = request.json
    query = data.get('query')
    engine = data.get('engine')
    supported_engines = [
        'gemini', 'gpt4', 'gemini-advance', 'gpt-turbo', 
        'gpt-3.5', 'simi', 'bing-balanced'
    ]

    if engine not in supported_engines:
        return jsonify({'error': 'Unknown engine'}), 400

    url = f'https://galihmrd.my.id/bard_ai?query={query}&engine={engine}'

    try:
        response = requests.get(url)
        response.raise_for_status() 
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
