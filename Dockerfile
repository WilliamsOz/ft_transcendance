FROM python:3.10-alpine

# Définition d'une variable d'environnement pour Python pour défactiver la mise en mémoire tampon de STDOUT/STDERR.
# Permet d'éviter tout délai dans l'affichage des messages de journalisation de Python.
ENV PYTHONUNBUFFERED 1

# Copie requirements.txt a l'intérieur du conteneur.
COPY ./requirements.txt /requirements.txt

# Installation du client Postgresql.
RUN apk add --update --no-cache postgresql-client

# Installation des dépendances de développement temporaires nécessaires pour installer certaines dépendances
# Python gcc, libc-dev, linux-headers et postgresql-dev.
RUN apk add --update --no-cache --virtual .tmp-build-deps \
	gcc libc-dev linux-headers postgresql-dev

# Utilisation de pip (gestionnaire de packages Pyhton) pou installer toutes les dépendances
# Python répertoriées dans le fichier 'requirements.txt'.
RUN pip install -r /requirements.txt

# Une fois les dépendances Python installées, cette commande supprime les dépendances de
# développement temporaires pour réduire la taille de l'image Docker finale.
RUN apk del .tmp-build-deps

# Création du répertoire '/app'
RUN mkdir /app

# Définition du répertoire de travail à '/app', toutes les commandes suivantes seront exécutées dans ce répertoire.
WORKDIR /app

# Copie du répertoire local '/app' à l'intérieur du conteneur.
COPY ./app /app

# Ajout d'un utilisateur 'user' à l'intérieur du conteneur.
RUN adduser -D user

# Définition de l'utilisateur par défaut pour exécuter les commandes suivantes dans l'image en tant que 'user' et non 'root'.
USER user