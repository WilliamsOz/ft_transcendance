NAME = ircserv

SRCS_PATH =	$(shell find src -type d)

OBJ_DIR = $(BUILD)/obj

INC_DIR = $(shell find includes -type d)

BUILD = .build

vpath %.cpp $(foreach dir, $(SRCS_PATH), $(dir):)

SRCS =  $(foreach dir, $(SRCS_PATH), $(foreach file, $(wildcard $(dir)/*.cpp), $(notdir $(file))))

OBJS = $(addprefix $(OBJ_DIR)/, $(SRCS:%.cpp=%.o))

CFLAGS = -Wall -Werror -Wextra -std=c++98

BFLAGS =	-DBONUS=1
NOBFLAGS =	-DBONUS=0

IFLAGS		=	$(foreach dir, $(INC_DIR), -I $(dir))

all :
	@make BONUS=$(NOBFLAGS) $(NAME)

$(NAME) :
	@docker-compose stop && docker-compose up --build -d --remove-orphans

$(OBJ_DIR)/%.o : %.cpp | $(BUILD)
	@c++ $(CFLAGS) $(BONUS) -c $< $(IFLAGS) -o $@

$(BUILD):
	@mkdir $@ $(OBJ_DIR)
	@echo "Object directory created\n"
	@echo "Compiling..\n"

clean :
	@rm -rf $(BUILD)
	@echo "Object directory deleted\n"

fclean : clean
	@rm -rf $(NAME)
	@echo "Executable removed\n"

bonus : fclean
	@make BONUS=$(BFLAGS) $(NAME)

re : fclean all