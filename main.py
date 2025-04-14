#funkcja tworząca zamek
def zamek(dlugosc, wysokosc):
    # minimalna długość murów
    if dlugosc < 20:
        dlugosc = 20
    # zapewnienie parzystej długości murów w celu poprawnego ustawienia lamp
    if dlugosc % 2 != 0:
        dlugosc = dlugosc + 1
    # minimalna wysokość muru
    if wysokosc < 2:
        wysokosc = 2 
    
    polowa_muru = dlugosc / 2

    # zapewnienie, że zamek będzie miał dość miejsca na schody
    # -7 ponieważ z dwóch stron nasz mur jest o grubości 3 bloków
    # więc szerokość naszego wnętrza zamku jest pomniejszona o 6 bloków
    # dodatkowo zostawiamy 1 blok wolny by dało się wygodnie wejśc na schody
    if wysokosc > dlugosc - 7:
        wysokosc = dlugosc - 7

    builder.teleport_to(pos(polowa_muru, 0, polowa_muru))
    builder.set_origin()
    
    #pętla tworząca 3 warstwowe mury dookoła gracza
    for i in range(4):
        builder.mark()
        builder.shift(dlugosc-2,wysokosc,2)
        builder.fill(MOSSY_STONE_BRICKS)
        builder.turn(TurnDirection.LEFT)
        # raz konstruktor przejdzie w górę, a raz w dół by wygodnie stworzyć mury
        wysokosc *= -1
    builder.shift(1,0,3)
    builder.turn(TurnDirection.LEFT)
    # zwiększamy wysokość by zgadzała się z rzeczywistą wysokością zamku
    wysokosc +=1
    # pętla tworząca schody
    for i in range(wysokosc):
        builder.mark()
        builder.raise_wall(STONE_BRICK_STAIRS, wysokosc-i)
        builder.move(FORWARD, 1)
    builder.teleport_to_origin()
    builder.shift(0,wysokosc,2)

    #pętla tworząca wierzchołki
    for i in range(4):
        for j in range(polowa_muru):
            builder.place(SEA_LANTERN)
            builder.move(FORWARD, 2)
        builder.turn(TurnDirection.RIGHT)
    # obracamy konstruktor po raz kolejny by móc tworzyć poprawnie więcej zamków (wcześniej raz obróciliśmy go w lewo!)
    builder.turn(TurnDirection.RIGHT)
player.on_chat("zamek",zamek)

# Agent buduje dla nas drzwi prowadzące do zamku
def drzwi():
    # teleportuje się do gracza i patrzy w tą samą stronę co gracz
    agent.teleport(pos(0, 0, 0), positions.to_compass_direction(player.get_orientation()))
    agent.set_item(DARK_OAK_DOOR, 1, 1)
    # niszczy mur - jest tu więcej kody niż, gdyby psuł podczas ruchu, ale agent szybciej wykonuje czynność
    for i in range(3):
        agent.destroy(FORWARD)
        agent.move(FORWARD, 1)
        agent.destroy(UP)
        agent.move(UP, 1)
        agent.destroy(RIGHT)
        agent.move(RIGHT, 1)
        agent.destroy(DOWN)
        agent.move(DOWN, 1)
        agent.move(LEFT, 1)
        # agent stawia drzwi
    for i in range(3):
        agent.move(BACK, 1)
        agent.place(FORWARD)
        agent.move(RIGHT, 1)
        agent.place(FORWARD)
        agent.move(LEFT, 1)
player.on_chat("drzwi",drzwi)     


def eq():
    
    przedmioty = [
        IRON_SWORD, 1,
        IRON_CHESTPLATE, 1,
        IRON_HELMET, 1,
        IRON_LEGGINGS, 1,
        IRON_BOOTS, 1,
        BOW, 1,
        ARROW, 64,
        BREAD, 64,
        SHIELD, 1
    ]

    for i in range( 0, len(przedmioty), 2):
        mobs.give(mobs.target(NEAREST_PLAYER), przedmioty[i], przedmioty[i+1])
    

player.on_chat("eq", eq)
