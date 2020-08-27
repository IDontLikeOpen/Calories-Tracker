// Storage control
const StorageCtrl = (function() {
    // const data = {
    //     items: [
    //         {id: 0, name: 'Steak Dinner', calories: 1200},
    //         {id: 1, name: 'Cookie', calories: 400},
    //         {id: 2, name: 'Eggs', calories: 300}
    //     ],
    //     currentItem: null,
    //     totalCalories: 0
    // }
    return {
        getLocalStorage: function(){
            let items
                // {id: 0, name: 'Steak Dinner', calories: 1200},
                //         {id: 1, name: 'Cookie', calories: 400},
                //         {id: 2, name: 'Eggs', calories: 300}
            
            if(localStorage.getItem('items') === null){
                // console.log(JSON.parse(localStorage.getItem('items'))+' thisi is true');
                items = [];
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
            
        },
        storeItemInLocalStorage: function(item) {
            let items = JSON.parse(localStorage.getItem('items'));
        
            items.push(item);
        
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearLocalStorage: function() {        
            localStorage.setItem('items', JSON.stringify([])); // if i can do this AND MAKE A BUTTON FOR THIS 
        },
        removeItemFromLocalStorage: function(item) { // CHANGE NUMERATION IN LOCAL STOR
            items = JSON.parse(localStorage.getItem('items'))
        
            items.splice(item.id,1);
            for (let i=item.id;i<items.length;i++) {
                items[i].id = i;
            }
        
            localStorage.setItem('items', JSON.stringify(items));
        },
        updateItemInLocalStorage: function(item) {
            items = JSON.parse(localStorage.getItem('items'))
            console.log(items+'1');
            items[item.id] = item;
            console.log(items+'2');
            localStorage.setItem('items', JSON.stringify(items));
        }
    }
})();

// Item control
const ItemCtrl = (function() {
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / state
    // const data = {
    //     items: [
    //         {id: 0, name: 'Steak Dinner', calories: 1200},
    //         {id: 1, name: 'Cookie', calories: 400},
    //         {id: 2, name: 'Eggs', calories: 300}
    //     ],
    //     currentItem: null,
    //     totalCalories: 0
    // }

    const items = StorageCtrl.getLocalStorage();

    const data = {
            items:items, // can i use one word?
            currentItem: null,
            totalCalories: 0
        }

    return {
        getItems: function(){
            return data.items;
        },
        addItem: function(name, calories){
            // console.log(name, calories);
            let ID
            // create id
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            
            calories = parseInt(calories);
            
            // New item
            newItem = new Item(ID, name, calories);

            //Add items to an arr
            data.items.push(newItem);

            StorageCtrl.storeItemInLocalStorage(newItem);

            return newItem;
        },
        UpdateCurrentItem: function(item) {
            updItem = data.items[item.id]
            updItem.name = item.name;
            updItem.calories = item.calories;
            StorageCtrl.updateItemInLocalStorage(item);
        },
        deleteItem: function(item){
            data.items.splice(item.id,1);
            StorageCtrl.removeItemFromLocalStorage(item);
            for (let i = item.id; i<data.items.length;i++ ){
                data.items[i].id = i;
            }
        },
        getItemById: function(id) {
            let found = null;
            // Loop through items
            data.items.forEach(item => {
                if(item.id === id){
                    found = item;
                }
            })
            return found
        },
        setCurrentItem: function(item) {
            data.currentItem = item
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        totalCalories: function(items){
            let sum=0;
            items.forEach(function(item){
                sum += item.calories;
            });
            console.log(sum+' sum sum');
            data.totalCalories= sum;
            return document.querySelector('.total-calories').textContent = parseInt(sum);
        },
        logData: function(){
            return data;
        }
    }
})(); /// efei or smth


// UI control
const UICtrl = (function() {
    // cool seelctor unit
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearAllBtn:'.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }

    return {
        populateItemList: function(items){
            let html = '';
// console.log(items);
            items.forEach(function(item){
              html += `<li class="collection-item" id="item-${item.id}">
              <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
              <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
              </a>
            </li>`;
            });

            // Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return {
                name:document.querySelector(UISelectors.itemNameInput).value,
                calories:document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item) {
            // show list 
            document.querySelector(UISelectors.itemList).style.display = 'block'
            // change total cals
            // document.querySelector(UISelectors.totalCalories).innerHTML = ItemCtrl.totalCalories(ItemCtrl.getItems());
            ItemCtrl.totalCalories(ItemCtrl.getItems());
            
            const li = document.createElement('li');
            // Add a class
            li.className = 'collection-item';
            // Add id
            li.id = `item-${item.id}`

            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
              </a>`
            // insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        updateListItem: function(item){
            const upd = document.querySelector(`#item-${item.id}`);
            upd.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
              </a>`;
            ItemCtrl.totalCalories(ItemCtrl.getItems());
            ItemCtrl.setCurrentItem(null);
        },
        deleteListItem: function(item) {
            const deleteItem = document.querySelector(`#item-${item.id}`);
            deleteItem.parentNode.removeChild(deleteItem);
            let liEls = document.querySelector('#item-list');
            if (liEls.hasChildNodes()) {
                let lis = Array.from(liEls.childNodes);
                console.log(lis+' yes');
                for (let li=item.id; li<lis.length; li++) {
                    console.log(' yes');
                    lis[li].id = `item-${li}`;
                }
            } else console.log('there are no items to revise');
            console.log(Array.from(liEls.childNodes));
            ItemCtrl.totalCalories(ItemCtrl.getItems());
            ItemCtrl.setCurrentItem(null);
        },
        clearFields: function() {
            document.querySelector(UISelectors.itemNameInput).value=''
            document.querySelector(UISelectors.itemCaloriesInput).value=''
        },
        addItemToForm : function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value=  ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none'
        },
        clearEditState: function() {
            UICtrl.clearFields();
            document.querySelector(UISelectors.updateBtn).style.display = 'none'   
            document.querySelector(UISelectors.deleteBtn).style.display = 'none'   
            document.querySelector(UISelectors.backBtn).style.display = 'none'   
            document.querySelector(UISelectors.addBtn).style.display = 'inline'
        },
        showEditState: function() {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline'   
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline'   
            document.querySelector(UISelectors.backBtn).style.display = 'inline'   
            document.querySelector(UISelectors.addBtn).style.display = 'none'
        },
        getSelectors: function() {
            return UISelectors
        }
    }
})();

// App control - the unit which gets everyone together and act does shit
const App = (function(ItemCtrl, UICtrl) {
    // Load ELs
    const loadEventListeners = function(){
        // Get UI sels
        const UISelectors = UICtrl.getSelectors();
        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)
        ItemCtrl.totalCalories(ItemCtrl.getItems());

        //eidt icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit);

        // update item button
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateBtn);

        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteBtn);

        document.querySelector(UISelectors.backBtn).addEventListener('click', BackBtn);

        document.querySelector(UISelectors.clearAllBtn).addEventListener('click', clearAll);
    }

    // Add item submit
    const itemAddSubmit = function(e){
        // get form input from ui ctrl
        const input = UICtrl.getItemInput();
        
        //If both arent empty 
        if(input.name !== '' && input.calories !== '') {
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            // Add item to a UI list
            UICtrl.addListItem(newItem);
            //Clear fields
            UICtrl.clearFields();
        }
        
        e.preventDefault();
    }

    // Update item submit
    const itemUpdateSubmit = function(e) {
        if (e.target.classList.contains('edit-item')) {
            const listId = e.target.parentNode.parentNode.id;
        
            // break into an array
            const listIdArr = listId.split('-');

            const id = parseInt(listIdArr[1]);

            // get Item
            const itemToEdit = ItemCtrl.getItemById(id);

            ItemCtrl.setCurrentItem(itemToEdit)

            // console.log(ItemCtrl.getCurrentItem().id+ ' 1');
            // console.log(document.querySelector(`#item-${ItemCtrl.getCurrentItem().id}`));

            UICtrl.addItemToForm();
        }
        e.preventDefault();
    }

    const itemUpdateBtn = function(e) {
        const input = UICtrl.getItemInput();
        if(input.name !== '' && input.calories !== ''){
            const item = ItemCtrl.getCurrentItem()

            item.name = input.name;
            item.calories = input.calories;

            ItemCtrl.UpdateCurrentItem(item);

            UICtrl.updateListItem(item);

            UICtrl.clearEditState();

            UICtrl.clearFields();
        }
        e.preventDefault();
    }

    const itemDeleteBtn = function(e) {
        const item = ItemCtrl.getCurrentItem()
        ItemCtrl.deleteItem(item);
        UICtrl.deleteListItem(item);
        UICtrl.clearEditState();
        UICtrl.clearFields();
        
        e.preventDefault();
    }

    const BackBtn = function(e) {
        ItemCtrl.setCurrentItem(null);
        UICtrl.clearEditState();
        UICtrl.clearFields();
        e.preventDefault();
    }

    const clearAll = function(e){
        StorageCtrl.clearLocalStorage();
        UICtrl.hideList();
        UICtrl.clearEditState();
        UICtrl.clearFields();
        e.preventDefault();
    }
    return {
        init: function(){
            // Cleaar edit state / set initial state
            UICtrl.clearEditState();
            
            console.log('Initing apppp......');

            // fetch items from data struct
            const items = ItemCtrl.getItems();

            // sheck if any items
            if(items.length ===0) {
                UICtrl.hideList();
            } else {
                // populate list with items
                UICtrl.populateItemList(items);
            }
        
            //load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl);

// Initialize app
// document.querySelector('.add-btn').addEventListener('click', (e) => {
//    e.preventDefault()
//     App.init();
    
// })
App.init();

// let a = ItemCtrl;
// console.log(a.logData());