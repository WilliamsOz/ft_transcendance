all :
	docker-compose up

$(NAME) :
	docker-compose up

clean :
	docker-compose down

fclean : clean
	docker image rm -f ft_transcendance_app:latest postgres:13-alpine

re : fclean all