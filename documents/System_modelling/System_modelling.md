# **Task 2 System modelling**


<br>

## **2.1 Draw an activity diagram to capture the business process between systems and the stakeholders in Task Assignment module**

<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task2/2.1-1.png?raw=true" alt="2.1-1.png"/>
</p>

#### **Activity diagram tổng quát cho task assignment**
**[Link to google drive](https://drive.google.com/file/d/15dzIsspIr4xfUpqlx7R71BOqT8Qix-Og/view?usp=sharing)**

Activity Diagram tổng quan cho bussiness process trong task assignment module
Các stakeholders:
- Back Officer: Phân công nhiệm vụ, phân công phương tiện, chấp thuận hoàn thành công việc cho workers.
- Workers: Nhận nhiệm vụ phân công, nhận thông báo từ back officer, làm việc, chờ sự chấp thuận thuận thành công việc từ back officer và trả phương tiện.


<br>

## **2.2 Think about a possible way for a back officer to assign vehicles to janitors and collectors. Draw a sequence diagram to visualize this process.**

Mô tả :
- Vì vai trò của Janitors và Collectors là như nhau trong task 2.2, nên nhóm gom chung thành 1 chủ thể đại diện là Workers, Back Officers mỗi lần giao xe chỉ cho 1 loại Workers duy nhất (chỉ Janitors hoặc chỉ Collectors)
- Khi 1 Back Officer muốn giao xe cho Workers, Back Officer bấm vào trang vehicles và chọn filter option là available
- Hệ thống sẽ lấy từ database trả về những xe có thể hoạt động ngay lúc đó cho Back Officer để lựa chọn
- Back Officer có thể nhìn những thông số của mỗi xe bên cạnh nút chọn như địa điểm, tình trạng của xe để chọn xe cần thiết với nhu cầu của mình. Sau đó Back Officer bấm vào xe mình muốn.
- Hệ thống sẽ lấy từ database rồi hiển thị bảng Assigns to Workers và list bên dưới là các Workers available
- Back Officer chọn các Workers trong ngưỡng giới hạn người và bấm xác nhận
- Hệ thống sẽ ghi nhận xác nhận đó và cập nhật vào database rằng xe đó đang được assign cho những Workers nào, chuyển xe sang trạng thái đã chứa các Workers, nhưng xe chưa bắt đầu hoạt động. Và cập nhật database bên phía Workers từng người một là đã được gắn với xe nào
- Hệ thống sẽ thông báo lại với Back Officer rằng đã xác nhận assign thành công, và cập nhật lại thông tin hiển thị trên màn hình. Đồng thời gửi thông báo đến các Workers được assign để họ kiểm tra thông tin mới về phương tiện từ Back Officer và chuẩn bị tinh thần cho nhiệm vụ tiếp theo từ Back Officer
- Trong sequence diagram, nhóm gọi phần controller liên quan đến task 2.2 là vehicle management system cho có phần liên quan và dễ hình dung.

Các entity liên quan
-  Back Officer: người thực hiện assign vehicle to worker
-  Back Officer UI: phần UI ở phía Back Officer
-  Assigned Workers UI: phần UI ở phía các workers được assigned
-  Vehicle Management System: phần controller của server liên quan đến quản lý vehicles
-  Database: phần cơ sở dữ liệu của cả hệ thống


<br>

### **2.1.1 Draw an activity diagram to capture the business process between systems and the stakeholders in Task Assignment module**

<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task2/2.2-1.png?raw=true" alt="2.2-1.png"/>
</p>

#### **Sequence diagram for the vehicles assigning task**
**[Link to google drive](https://drive.google.com/file/d/1YP5INjfnhuHtQDH-BBlsIZYhd3-Yiq-B/view?usp=sharing)**

Mô tả Back Officer UI
- UI sẽ danh sách tất cả các vehicles, back officers có thể lọc để chọn ra các phương tiện trống ( available vehicles) và giao xe cho worker.
- clickToVehiclesPage(): Khi Back Officer click vào mục vehicls ở sidebar thì sẽ chuyển trang sang vehicles page và ở trang đó hiện ra danh sách các xe. 
- clickFilterForAvailableVehicles(): Filter để chọn ra những phương tiện có thể phân công được (available)
- displayListOfAvailableVehivles(list Vehicles) : Hiển thị danh sách các xe có thể gán được
- selectVehiclesFromTheListAvailable(Vehicle) : Back Officer chọn phương tiện để phân công cho Worker
- displayListOfAvailableWorkers(list Workers) : Hiện ra danh sách Worker có thể phân công.
- selectWorkersFromTheList(Workers)  : Chọn worker để phân công
- pop-upAssignVehiclesFailed(): Hiện modal thông báo với nội dung "Phân công thất bại"
- pop-upAssignVehiclesSucessfully(): Hiện modal thông báo với nội dung "Phân công thành công". 

Mô tả Vehicle Management System
- requestForAvailableVehicles(): Gửi request lọc ra những available vehicles tới database rồi trả kết quả về cho hệ thống.
- requestForAvailableWorkers(): Gửi request lọc ra những available workers tới database rồi trả kết quả về cho hệ thống.
- requestAssignVehicleToWorkers(Vehicle, Workers): Gửi request cập nhật trạng thái tới database rằng xe đó đang được assign cho những Workers nào, chuyển xe sang trạng thái đã chứa các Workers và ngược lại. Trả về message thành công hay thất bại cho hệ thống.

Mô tả Database
- GetListOfAvailableVehicles(): lấy danh sách Available Vehicles
- GetListOfAvailableWorkers()(): lấy danh sách Available Workers
- UpdateVehicleStatusWithAssignedWorkersViceVersa(Vehicle, Workers): cập nhật database bên phía Vehicle được gắn với những Workers nào, và bên phía Workers từng Worker một được gắn với một Vehicle cụ thể.
- AddNotificationToWorkerDbs(Worker, Notification): thêm Notification vào WorkerDbs

Mô tả Assigned Workers UI
- pop-upNewNotification(WorkerId,Notification): hiện thông báo từ Back Officer đến các UI của Workers vừa được Vehicle-Assigned với nội dung họ đã được Assigned với Vehicle nào.

<br>

## **2.3 Draw a class diagram of Task Assignment module as comprehensive as possible**
<br>

### **2.3.1 Class Account**
<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task2/2.3-1.png?raw=true" alt="2.3-1.png"/>
</p>


### **2.3.2 Class Employee**
<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task2/2.3-2.png?raw=true" alt="2.3-2.png"/>
</p>


<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task2/2.3-3.png?raw=true" alt="2.3-3.png"/>
</p>



<br>

### **2.3.3 Class Point**

<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task2/2.3-4.png?raw=true" alt="2.3-4.png"/>
</p>

<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task2/2.3-5.png?raw=true" alt="2.3-5.png"/>
</p>

<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task2/2.3-6.png?raw=true" alt="2.3-6.png"/>
</p>

<br>

### **2.3.4 Class Routes**

<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task2/2.3-7.png?raw=true" alt="2.3-7.png"/>
</p>

<br>

### **2.3.5 Class vehicles**
<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task2/2.3-8.png?raw=true" alt="2.3-8.png"/>
</p>
<br>

### **2.3.6 Class Diagram of Task Assignment module**

<br>
<p align="center">
    <img src="../../pictures/Task2/2.3-9.png?raw=true" alt="2.3-9.png"/>
</p>
<br>

#### **Activity diagram tổng quát cho task assignment**
**[Link to google drive](https://drive.google.com/file/d/1k09Um2rymlbh6AJ2VIQ-IrwnwwVJ8m48/view?usp=sharing)**


<br>

## **2.4 Develop MVP 1 as user interfaces of either a Desktop-view central dashboard for Task Management for back-officers**

<br>

#### **Activity diagram tổng quát cho task assignment**
**[Link to figma](https://www.figma.com/file/iqOUdjmkFKlZVXzlmmbIsN/CNPM?node-id=0%3A1&t=XoAHWW200uwvuvir-0)**