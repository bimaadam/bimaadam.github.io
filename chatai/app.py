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

    if engine == 'gemini':
        url = 'https://galihmrd.my.id/bard_ai?query=' + query + '&engine=gemini-advance'
    elif engine == 'gpt4':
        url = 'https://galihmrd.my.id/bard_ai?query=' + query + '&engine=gpt4'
    else:
        return jsonify({'error': 'Unknown engine'}), 400

    try:
        response = requests.get(url)
        response.raise_for_status()  # Raises exception for bad response status
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
