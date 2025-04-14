// funkcja tworząca zamek
player.onChat("zamek", function zamek(dlugosc: number, wysokosc: number) {
    let i: number;
    //  minimalna długość murów
    if (dlugosc < 20) {
        dlugosc = 20
    }
    
    //  zapewnienie parzystej długości murów w celu poprawnego ustawienia lamp
    if (dlugosc % 2 != 0) {
        dlugosc = dlugosc + 1
    }
    
    //  minimalna wysokość muru
    if (wysokosc < 2) {
        wysokosc = 2
    }
    
    let polowa_muru = dlugosc / 2
    //  zapewnienie, że zamek będzie miał dość miejsca na schody
    //  -7 ponieważ z dwóch stron nasz mur jest o grubości 3 bloków
    //  więc szerokość naszego wnętrza zamku jest pomniejszona o 6 bloków
    //  dodatkowo zostawiamy 1 blok wolny by dało się wygodnie wejśc na schody
    if (wysokosc > dlugosc - 7) {
        wysokosc = dlugosc - 7
    }
    
    builder.teleportTo(pos(polowa_muru, 0, polowa_muru))
    builder.setOrigin()
    // pętla tworząca 3 warstwowe mury dookoła gracza
    for (i = 0; i < 4; i++) {
        builder.mark()
        builder.shift(dlugosc - 2, wysokosc, 2)
        builder.fill(MOSSY_STONE_BRICKS)
        builder.turn(TurnDirection.Left)
        //  raz konstruktor przejdzie w górę, a raz w dół by wygodnie stworzyć mury
        wysokosc *= -1
    }
    builder.shift(1, 0, 3)
    builder.turn(TurnDirection.Left)
    //  zwiększamy wysokość by zgadzała się z rzeczywistą wysokością zamku
    wysokosc += 1
    //  pętla tworząca schody
    for (i = 0; i < wysokosc; i++) {
        builder.mark()
        builder.raiseWall(STONE_BRICK_STAIRS, wysokosc - i)
        builder.move(FORWARD, 1)
    }
    builder.teleportToOrigin()
    builder.shift(0, wysokosc, 2)
    // pętla tworząca wierzchołki
    for (i = 0; i < 4; i++) {
        for (let j = 0; j < polowa_muru; j++) {
            builder.place(SEA_LANTERN)
            builder.move(FORWARD, 2)
        }
        builder.turn(TurnDirection.Right)
    }
    //  obracamy konstruktor po raz kolejny by móc tworzyć poprawnie więcej zamków (wcześniej raz obróciliśmy go w lewo!)
    builder.turn(TurnDirection.Right)
})
//  Agent buduje dla nas drzwi prowadzące do zamku
player.onChat("drzwi", function drzwi() {
    let i: number;
    //  teleportuje się do gracza i patrzy w tą samą stronę co gracz
    agent.teleport(pos(0, 0, 0), positions.toCompassDirection(player.getOrientation()))
    agent.setItem(DARK_OAK_DOOR, 1, 1)
    //  niszczy mur - jest tu więcej kody niż, gdyby psuł podczas ruchu, ale agent szybciej wykonuje czynność
    for (i = 0; i < 3; i++) {
        agent.destroy(FORWARD)
        agent.move(FORWARD, 1)
        agent.destroy(UP)
        agent.move(UP, 1)
        agent.destroy(RIGHT)
        agent.move(RIGHT, 1)
        agent.destroy(DOWN)
        agent.move(DOWN, 1)
        agent.move(LEFT, 1)
    }
    //  agent stawia drzwi
    for (i = 0; i < 3; i++) {
        agent.move(BACK, 1)
        agent.place(FORWARD)
        agent.move(RIGHT, 1)
        agent.place(FORWARD)
        agent.move(LEFT, 1)
    }
})
player.onChat("eq", function eq() {
    let przedmioty = [IRON_SWORD, 1, IRON_CHESTPLATE, 1, IRON_HELMET, 1, IRON_LEGGINGS, 1, IRON_BOOTS, 1, BOW, 1, ARROW, 64, BREAD, 64, SHIELD, 1]
    for (let i = 0; i < przedmioty.length; i += 2) {
        mobs.give(mobs.target(NEAREST_PLAYER), przedmioty[i], przedmioty[i + 1])
    }
})
