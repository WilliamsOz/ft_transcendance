UNAME_S := $(shell uname -s)

ifeq ($(UNAME_S), Darwin) # Mac
	RM_IMAGE_COMMAND := docker image rm -f ft_transcendance-app
else # Linux
	RM_IMAGE_COMMAND := docker image rm -f ft_transcendance-app
endif

all:
	docker-compose up

$(NAME):
	docker-compose up

clean:
	docker-compose down

fclean: clean
	$(RM_IMAGE_COMMAND) postgres:13-alpine
	rm -rf app/User/__pycache__
	rm -rf app/User/migrations/__pycache__
	rm -rf app/User/migrations/0001_initial.py
	rm -rf app/Game/__pycache__
	rm -rf app/Game/migrations/__pycache__
	rm -rf app/Game/migrations/0001_initial.py
	rm -rf app/app/__pycache__

re: fclean all

shell: all
	docker exec -it python sh -c "python manage.py shell"
