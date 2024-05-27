import os, requests
from django.shortcuts import render, redirect
from django.http import HttpResponse
from dotenv import load_dotenv
from django.http import JsonResponse
from django.core.exceptions import ValidationError
from User.models import User

def log(request):
	return render(request, 'templates/app/log.html')

def home(request, user_id):
	user = User.objects.get(user_id=user_id)
	return render(request, 'templates/app/home.html', {'user': user})

def oauth_token(request):
	load_dotenv()
	code = request.GET.get('code')
	if code:
		url = 'https://api.intra.42.fr/oauth/token'
		data = {
			'grant_type': 'authorization_code',
			'client_id': os.environ.get('CLIENT_ID'),
			'client_secret': os.environ.get('CLIENT_SECRET'),
			'code': code,
			'redirect_uri': 'http://localhost:3003/oauth/token',
		}
		response = requests.post(url, data=data)
		data = response.json()
		request.session['data'] = data
		return redirect('create-user')

def create_user(request):
	data = request.session.get('data')
	if 'data' in request.session:
		del request.session['data']
	token = data.get('access_token')
	if token:
		headers = {'Authorization': f'Bearer {token}'}
		url = 'https://api.intra.42.fr/v2/me'
		user_data = requests.get(url, headers=headers).json()
		try:
			login42 = user_data.get('login')
			email = user_data.get('email')
			image = user_data.get('image')
			user, created = User.objects.get_or_create(
				login42=login42,
				email=email,
				defaults={
					'token': token
				}
			)
			if not created:
				user.token = token
			user.save()  # Enregistrer l'objet User dans la base de données
			return redirect('home', user_id=user.user_id)
		except Exception as e:
			print(f"Erreur lors de l'enregistrement de l'utilisateur: {e}")
		return HttpResponse("Erreur : ici chat gpt", status=400)
	else:
		return HttpResponse("Erreur : Token d'accès non trouvé.", status=400)

def profil(request, user_id):
	user = User.objects.get(user_id=user_id)
	return render(request, 'User/profil.html', {'user': user})