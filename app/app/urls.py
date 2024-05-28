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
from User.views import log, home, create_user, oauth_token, profil, RGPD_Politique
from Game.views import rapid_game_auth, create_tournament, play_game, home_game, player_registration, start_tournament, end_match, ia_game, play_ia_game
from Game.views import morpion_game , save_morpion_game, game_history, game_over , morpion_form

urlpatterns = [
	path('admin/', admin.site.urls),

	path('', log, name='log'),
	path('home/<int:user_id>/', home, name='home'),

	path('create-user/', create_user, name='create-user'),
	path('oauth/token/', oauth_token, name='oauth-token'),
	path('profil/<int:user_id>/', profil, name='profil'),


	path('home_game/<int:user_id>/', home_game, name='home_game'),

	path('home_game/rapid_game_auth/<int:user_id>/', rapid_game_auth, name='rapid_game_auth'),
	path('home_game/play_game/<int:user_id>/<str:playerOne>/<str:playerTwo>/', play_game, name='play_game'),

	path('home_game/ia_game_auth/<int:user_id>/', ia_game, name='ia_game_auth'),
	path('home_game/play_ia_game/<int:user_id>/<str:playerOne>/', play_ia_game, name='play_ia_game'),

	path('home_game/create_tournament/<int:user_id>/', create_tournament, name='create_tournament'),
	path('home_game/player_registration/<int:user_id>/<int:tournament_id>/', player_registration, name='player_registration'),
	path('home_game/start_tournament/<int:user_id>/<int:tournament_id>/', start_tournament, name='start_tournament'),
	path('end_match/<int:match_id>/', end_match, name='end_match'),

	path('home_game/play_game/<int:user_id>/<str:playerTwo>/', play_game, name='play_game'),

	path('morpion_form/<int:user_id>/', morpion_form, name='morpion_form'),
    path('morpion_game/<int:user_id>/<str:playerTwo>/', morpion_game, name='morpion_game'),
    path('save_morpion_game/', save_morpion_game, name='save_morpion_game'),
    path('game_over/<int:user_id>/<str:result>/', game_over, name='game_over'),
    path('morpion_history/<int:user_id>/', game_history, name='game_history'),


	path('RGPD_Politique/', RGPD_Politique, name='RGPD_Politique'),

]