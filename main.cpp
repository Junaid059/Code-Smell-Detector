#include <iostream>
#include <vector>
#include <string>
using namespace std;

class BankAccount
{
public:
    string accountHolder;
    string accountNumber;
    string HolderHouse;
    string HolderStreet;
    string HolderCity;
    string HolderCountry;
    string HolderZip;
    double balance;

    BankAccount(string holder, string number, double initialBalance, string house, string street, string city, string country, string zip)
    {
        accountHolder = holder;
        accountNumber = number;
        balance = initialBalance;
        HolderHouse = house;
        HolderStreet = street;
        HolderCity = city;
        HolderCountry = country;
        HolderZip = zip;
    }

    void deposit(double amount)
    {
        if (amount <= 0)
        {
            cout << "Deposit amount must be positive!" << endl;
        }
        else
        {
            balance += amount;
            cout << "Deposited: " << amount << ", New Balance: " << balance << endl;
        }
    }
    void withdraw(double amount)
    {
        if (amount <= 0)
        {
            cout << "Withdrawal amount must be positive!" << endl;
        }
        else if (amount > balance)
        {
            cout << "Insufficient balance!" << endl;
        }
        else
        {
            balance -= amount;
            cout << "Withdrawn: " << amount << ", New Balance: " << balance << endl;
        }
    }
    void updateAddress(string house, string street, string city, string country, string zip)
    {
        HolderHouse = house;
        HolderStreet = street;
        HolderCity = city;
        HolderCountry = country;
        HolderZip = zip;
    }
    void displayAddress()
    {
        cout << "Address: " << HolderHouse << ", " << HolderStreet << ", " << HolderCity << ", " << HolderCountry << ", " << HolderZip << endl;
    }
    void printAccountDetails()
    {
        cout << "Account Holder: " << accountHolder
             << ", Account Number: " << accountNumber
             << ", Balance: " << balance << endl;
    }
    void printAccountDetailsWithAddress()
    {
        cout << "Account Holder: " << accountHolder
             << ", Account Number: " << accountNumber
             << ", Balance: " << balance
             << ", Address: " << HolderHouse << ", " << HolderStreet << ", " << HolderCity << ", " << HolderCountry << ", " << HolderZip << endl;
    }
    void printAccountDetails()
    {
        cout << "Account Holder: " << accountHolder
             << ", Account Number: " << accountNumber
             << ", Balance: " << balance << endl;
    }
    void printAccountDetails()
    {
        cout << "Account Holder: " << accountHolder
             << ", Account Number: " << accountNumber
             << ", Balance: " << balance << endl;
    }
    void printAccountDetails()
    {
        cout << "Account Holder: " << accountHolder
             << ", Account Number: " << accountNumber
             << ", Balance: " << balance << endl;
    }

    void displayDetails() const
    {
        if (accountHolder.empty())
        {
            cout << "Name: null" << endl;
        }
        else
        {
            cout << "Name: " << accountHolder << endl;
        }

        if (accountNumber.empty())
        {
            cout << "Account Number: null" << endl;
        }
        else
        {
            cout << "Account Number: " << accountNumber << endl;
        }

        if (HolderHouse.empty())
        {
            cout << "House: null" << endl;
        }
        else
        {
            cout << "House: " << HolderHouse << endl;
        }
        if (HolderStreet.empty())
        {
            cout << "Street: null" << endl;
        }
        else
        {
            cout << "Street: " << HolderStreet << endl;
        }
        if (HolderCity.empty())
        {
            cout << "City: null" << endl;
        }
        else
        {
            cout << "City: " << HolderCity << endl;
        }
        cout << "Balance: " << balance << endl;
    }
};

class Bank
{
private:
    vector<BankAccount> accounts;

public:
    void addAccount(string holder, string number, double initialBalance, string house, string street, string city, string country, string zip)
    {
        BankAccount newAccount(holder, number, initialBalance, house, street, city, country, zip);
        accounts.push_back(newAccount);
        cout << "Account added for " << holder << " with account number: " << number << endl;
    }

    void manageAccounts()
    {
        for (int i = 0; i < accounts.size(); i++)
        {
            cout << "Managing account for " << accounts[i].accountHolder << endl;
            accounts[i].deposit(100);
            accounts[i].withdraw(50);
            accounts[i].withdraw(200);
        }
    }

    void printAccountDetails()
    {
        for (int i = 0; i < accounts.size(); i++)
        {
            cout << "Account Holder: " << accounts[i].accountHolder
                 << ", Account Number: " << accounts[i].accountNumber
                 << ", Balance: " << accounts[i].balance << endl;
        }
    }

    void performTransactions()
    {
        for (int i = 0; i < accounts.size(); i++)
        {
            // Performing transactions with some arbitrary values
            accounts[i].deposit(150);
            accounts[i].withdraw(30);
            accounts[i].withdraw(500);
            accounts[i].deposit(200);
        }
    }

    void simulateBankingOperations()
    {
        for (int i = 0; i < accounts.size(); i++)
        {
            cout << "Simulating banking operations for " << accounts[i].accountHolder << endl;
            accounts[i].deposit(100);
            accounts[i].withdraw(50);
            accounts[i].withdraw(150);
            accounts[i].deposit(300);
            accounts[i].withdraw(200);
        }
    }
    // void simulateBankingOperations()
    // {
    //     for (int i = 0; i < accounts.size(); i++)
    //     {
    //         cout << "Simulating banking operations for " << accounts[i].accountHolder << endl;
    //         accounts[i].deposit(100);
    //         accounts[i].withdraw(50);
    //         accounts[i].withdraw(150);
    //         accounts[i].deposit(300);
    //         accounts[i].withdraw(200);
    //     }
    // }
};

int main()
{
    Bank bank;
    bank.addAccount("Alice", "123456789", 500);
    bank.addAccount("Bob", "987654321", 1000);

    bank.manageAccounts();
    bank.printAccountDetails();
    bank.performTransactions();
    bank.simulateBankingOperations();

    return 0;
}
