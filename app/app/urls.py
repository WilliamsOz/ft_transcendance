"""
URL configuration for app project.

The `urlpatterns` list routes URLs to views. For more information please see:
	https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
	1. Add an import:  from my_app import views
	2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
	1. Add an import:  from other_app.views import Home
	2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
	1. Import the include() function: from django.urls import include, path
	2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from User.views import log, home, create_user, oauth_token, profil, redirect_to_home, verify_code, verify_totp, enable_totp
from Game.views import rapid_game_auth, create_tournament, play_game, home_game, player_registration, start_tournament, end_match, ia_game, play_ia_game
from Game.views import morpion_game , save_morpion_game, game_history, game_over , morpion_form
from django.contrib.auth.views import LogoutView

urlpatterns = [
	path('admin/', admin.site.urls),

	path('', log, name='log'),
	path('home/<int:id>/', home, name='home'),

	path('oauth/token/', oauth_token, name='oauth-token'),
	path('create-user/', create_user, name='create-user'),
	path('verify-code/', verify_code, name='verify-code'),
	path('profil/<int:id>/', profil, name='profil'),
	path('enable-totp/', enable_totp, name='enable-totp'),
	path('verify-totp/', verify_totp, name='verify-totp'),

	path('redirect/', redirect_to_home, name='redirect_to_home'),
	path('logout/', LogoutView.as_view(template_name='User/login.html'), name='logout'),


	path('home_game/<int:id>/', home_game, name='home_game'),

	path('home_game/rapid_game_auth/<int:id>/', rapid_game_auth, name='rapid_game_auth'),
	path('home_game/play_game/<int:id>/<str:playerOne>/<str:playerTwo>/', play_game, name='play_game'),

	path('home_game/ia_game_auth/<int:id>/', ia_game, name='ia_game_auth'),
	path('home_game/play_ia_game/<int:id>/<str:playerOne>/', play_ia_game, name='play_ia_game'),

	path('home_game/create_tournament/<int:id>/', create_tournament, name='create_tournament'),
	path('home_game/player_registration/<int:id>/<int:tournament_id>/', player_registration, name='player_registration'),
	path('home_game/start_tournament/<int:id>/<int:tournament_id>/', start_tournament, name='start_tournament'),
	path('end_match/<int:match_id>/', end_match, name='end_match'),

	path('home_game/play_game/<int:id>/<str:playerTwo>/', play_game, name='play_game'),

	path('morpion_form/<int:id>/', morpion_form, name='morpion_form'),
    path('morpion_game/<int:id>/<str:playerTwo>/', morpion_game, name='morpion_game'),
    path('save_morpion_game/', save_morpion_game, name='save_morpion_game'),
    path('game_over/<int:id>/<str:result>/', game_over, name='game_over'),
    path('morpion_history/<int:id>/', game_history, name='game_history'),

]