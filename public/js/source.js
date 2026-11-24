$(function () {
    // *********************************************************************
    // Feel free to modify/remove the JS objects below.
    // *********************************************************************

    let username = "UTRGV Vaqueros";

    const customers = [
        {
            "name": "Alice Johnson",
            "email": "alice@example.com",
            "status": "Active",
            "joined": "09/10/2026"
        },
        {
            "name": "Robert Smith",
            "email": "robert@example.com",
            "status": "Pending",
            "joined": "09/12/2026"
        },
        {
            "name": "Maria Garcia",
            "email": "maria@example.com",
            "status": "Active",
            "joined": "09/15/2026"
        }
    ];

    const activities = [
        {
            "message" : "New customer registered"
        },
        {
            "message" : "Order #10482 completed"
        },
        {
            "message" : "Payment received"
        },
        {
            "message" : "Support ticket created"
        }
    ];

    // There are 13 requirements to implement. 
    const userNameObj = $("#username");
    userNameObj.append(`${username}`);

    $.getJSON("/api/stats", function (stats) {
        const revenue = Number(stats.revenue).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        });

        $(".revenue-amt").text(revenue);
        $("#customer-num").text(Number(stats.customers).toLocaleString("en-US"));
        $("#orders-amt").text(Number(stats.orders).toLocaleString("en-US"));
        $("#issues-amt").text(stats.issues);
        $("#notification-num").text(stats.notifications);
    });

    const tableBody = $("#customerTableBody");

    customers.forEach(customer => {
        const row = $("<tr>");

        var statusClass;
            if (customer.status.toLowerCase() === "active"){
                statusClass = "status-active";
            } else {
                statusClass = "status-pending";
            }
        row.html(`
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>
                <span class="status ${statusClass}">
                    ${customer.status}
                </span>
            </td>
            <td>${customer.joined}</td>
        `);

        tableBody.append(row);
    });

   
    $.getJSON("/api/sales", function (sales) {
        const salesTableBody = $("#salesTableBody");

        sales.forEach(sale => {
            const revenue = Number(sale.saleamount).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
            });
            const row = $("<tr>");

            row.html(`
                <td>${sale.name}</td>
                <td>${sale.quantity}</td>
                <td>${revenue}</td>
            `);

            salesTableBody.append(row);
        });
    });

    const activityList = $("#activity-list");

    activities.forEach(activity => {
        const li = $("<li>");
        li.html(`${activity.message}`);
        activityList.append(li);
    });

 
    function fillAlertList(selector, rows) {
        const list = $(selector);

        rows.forEach(row => {
            const li = $("<li>");
            li.text(row.description);
            list.append(li);
        });
    }

    $.when(
        $.getJSON("/api/alerts/issues"),
        $.getJSON("/api/alerts/notifications"),
        $.getJSON("/api/alerts/tasks")
    ).done(function (issues, notifications, tasks) {
        fillAlertList("#system-status-list", issues[0]);
        fillAlertList("#notifications-list", notifications[0]);
        fillAlertList("#tasks-list", tasks[0]);
        $("#accordion").accordion("refresh");
    });


    // All six jQuery UI functions

    $("button").button();
       
    $("#dashboardTabs").tabs();

    $("#customerDate").datepicker();

    $("#accordion").accordion({
        collapsible: true,
        heightStyle: "content"
    });

    $("#customerDialog").dialog({
        autoOpen: false,
        modal: true,
        width: 450,
        buttons: {
            "Create Customer": function () {
                var name = $("#customerName").val();
                var email = $("#customerEmail").val();
                if (!name || !email) {
                    alert(
                        "Please enter a name and email."
                    );
                    return;
                }

                alert("Customer created: " + name);
                $(this).dialog("close");
            },
            "Cancel": function () {
                $(this).dialog("close");
            }
        }

    });


    $("#newCustomerButton").on(
        "click",
        function () {
            $("#customerDialog").dialog("open");
        }
    );



       


    });
