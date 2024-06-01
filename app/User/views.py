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

from .utils import send_verification_code ##
from .models import VerificationCode ##
from .forms import CodeVerificationForm, TwoFactorToggleForm #
import uuid

@login_required
def toggle_two_factor(request):
    user = request.user
    if request.method == 'POST':
        form = TwoFactorToggleForm(request.POST, instance=user)
        if form.is_valid():
            form.save()
            return redirect('profil', id=user.id)
    else:
        form = TwoFactorToggleForm(instance=user)
    return render(request, 'toggle_two_factor.html', {'form': form})

@login_required
def redirect_to_home(request):
    id = request.user.id
    return redirect('home', id=id)

def log(request):
	return render(request, 'templates/app/log.html')

@login_required
def home(request, id):
	user = User.objects.get(id=id)
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
			if user.is_two_factor_enabled:
				send_verification_code(user)
				request.session['user_id'] = user.id
				return redirect('verify-code')
			else:
				login(request, user)
				return redirect('home', id=user.id)
		except User.DoesNotExist:
			user = User()
			user.login42 = user_data.get('login')
			user.email = user_data.get('email')
			user.token = user_data.get('token')
			user.profile_photo = user_data['image']['versions']['small']
			user.save()
			send_verification_code(user)
			request.session['user_id'] = user.id
		return redirect('home', id=user.id)
	return redirect('log')
	
@login_required
def profil(request, id):
    user = request.user
    if user.id != id:
        return redirect('home', id=user.id)
    if request.method == 'POST':
        form = TwoFactorToggleForm(request.POST, instance=user)
        if form.is_valid():
            form.save()
            return redirect('profil', id=user.id)
    else:
        form = TwoFactorToggleForm(instance=user)
    return render(request, 'User/profil.html', {'form': form, 'user': user})


def verify_code(request):
    user_id = request.session.get('user_id')
    if not user_id:
        return redirect('log')
    user = User.objects.get(id=user_id)
    error_message = None
    if request.method == 'POST':
        form = CodeVerificationForm(request.POST)
        if form.is_valid():
            code = form.cleaned_data.get('code')
            try:
                uuid_code = uuid.UUID(code)
                verification_code = VerificationCode.objects.get(user=user, code=uuid_code)
                if verification_code.is_valid():
                    login(request, user)
                    return redirect('home', id=user.id)
                else:
                    error_message = 'Code de vérification invalide ou expiré.'
            except (VerificationCode.DoesNotExist, ValueError, ValidationError):
                error_message = 'Code de vérification invalide.'
        else:
            error_message = 'Le formulaire contient des erreurs.'
    else:
        form = CodeVerificationForm()
    return render(request, 'User/verify_code.html', {'form': form, 'error_message': error_message})