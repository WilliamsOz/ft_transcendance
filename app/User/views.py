import os, requests
from django.shortcuts import render, redirect
from django.http import HttpResponse
from dotenv import load_dotenv
from django.http import JsonResponse
from django.core.exceptions import ValidationError
from django.contrib.auth import login, authenticate, logout
from django.views.generic import View
from django.contrib.auth.decorators import login_required 
from User.models import User
from django.shortcuts import get_object_or_404
from django.contrib import messages
import random
import string



@login_required
def redirect_to_home(request):
    id = request.user.id
    return redirect('home', id=id)

def log(request):
	return render(request, 'templates/app/log.html')

@login_required
def delete_user(request, id):
    if request.method == 'POST':
        user = get_object_or_404(User, id=id)
        if user == request.user: 
            user.delete()
            return redirect('log')
    return render(request, 'templates/app/delete_user.html', {'user': user})

login_required
def anonymize_user(request, id):
    user = get_object_or_404(User, id=id)
    if request.method == 'POST' and user == request.user:
        # Générer un login42 unique
        unique_login = False
        while not unique_login:
            new_login42 = f'anonymous_{user.id}_{random.choice(string.ascii_lowercase)}{random.randint(1, 10000)}'
            if not User.objects.filter(login42=new_login42).exists():
                unique_login = True

        user.login42 = new_login42
        user.email = f'anonymous_{user.id}@example.com'
        user.username = new_login42
        print(user.username)
        user.profile_photo = 'https://www.gravatar.com/avatar/'
        user.save()
        messages.success(request, 'Vos données personnelles ont été anonymisées.')
        return redirect('home', id=user.id)
    return render(request, 'templates/app/anonymize_user.html', {'user': user})
@login_required
def home(request, id):
    user = get_object_or_404(User, id=id)
    if not user.consent_RGPD:
        return redirect('consent', id=id)
    return render(request, 'templates/app/home.html', {'user': user})

@login_required
def consent(request, id):
    user = get_object_or_404(User, id=id)
    if request.method == 'POST':
        user.consent_RGPD = True
        user.save()
        return redirect('home', id=user.id)
    return render(request, 'templates/app/consent.html', {'user': user})


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
			'redirect_uri': 'https://localhost:3003/oauth/token',
		}
		response = requests.post(url, data=data)
		data = response.json()
		token = data.get('access_token')
		if token:
			headers = {'Authorization': f'Bearer {token}'}
			url = 'https://api.intra.42.fr/v2/me'
			user_data = requests.get(url, headers=headers).json()
			user_data['token'] = token
		else:
			return HttpResponse("Erreur : Token d'accès non trouvé.", status=400)
		request.session['user_data'] = user_data
		return redirect('create-user')

def create_user(request):
	user_data = request.session.get('user_data')
	if user_data:
		try:
			user = User.objects.get(login42=user_data.get('login'))
			login(request, user)
		except User.DoesNotExist:
			user = User()
			user.login42 = user_data.get('login')
			user.email = user_data.get('email')
			user.token = user_data.get('token')
			user.profile_photo = user_data['image']['versions']['small']
			user.save()
			login(request, user)
		return redirect('home', id=user.id)
	return redirect('log')
	
@login_required
def profil(request, id):
	user = User.objects.get(id=id)
	return render(request, 'User/profil.html', {'user': user})

def RGPD_Politique(request, id):
	user = User.objects.get(id=id)
	return render(request, 'User/rgpd.html', {'user': user})