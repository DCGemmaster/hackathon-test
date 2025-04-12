import random
import time

inventory = []

def cast_line():
    print("Casting your line...")
    time.sleep(2)
    catch_chance = random.randint(1, 100)

    if catch_chance > 70:
        fish = random.choice(["Salmon", "Trout", "Bass", "Catfish"])
        print(f"🎣 You caught a {fish}!")
        inventory.append(fish)
    else:
        print("😕 Nothing bit this time.")

def check_inventory():
    print("\n🎒 Your Inventory:")
    if inventory:
        for i, fish in enumerate(inventory, 1):
            print(f"{i}. {fish}")
    else:
        print("You haven't caught anything yet.")
    print()

def main():
    print("Welcome to the Fishing Game!")
    
    while True:
        print("\nWhat would you like to do?")
        print("1. Cast line")
        print("2. Check inventory")
        print("3. Quit")
        
        choice = input("> ")
        
        if choice == "1":
            cast_line()
        elif choice == "2":
            check_inventory()
        elif choice == "3":
            print("Goodbye!")
            break
        else:
            print("Invalid choice. Try again.")

if __name__ == "__main__":
    main()
