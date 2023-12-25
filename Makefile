OBJ_DIR = $(BUILD)/obj

INC_DIR = $(shell find includes -type d)

BUILD = .build

vpath %.cpp $(foreach dir, $(SRCS_PATH), $(dir):)

SRCS =  $(foreach dir, $(SRCS_PATH), $(foreach file, $(wildcard $(dir)/*.cpp), $(notdir $(file))))

OBJS = $(addprefix $(OBJ_DIR)/, $(SRCS:%.cpp=%.o))

all :
	docker-compose stop && docker-compose up --build -d --remove-orphans

$(NAME) :
	docker-compose stop && docker-compose up --build -d --remove-orphans

clean :
	docker rm -f backend pgadmin-portal frontend bp-pg-db

fclean : clean
	docker rmi -f ft_transcendance-backend dpage/pgadmin4 postgres:12-alpine ft_transcendance-frontend

re : fclean all