# **Task 1 Requirement elicitation**

## **1.1 Describe the domain context of Urban waste management in Vietnam. Who  are relevant stakeholders? What are their current needs? In your opinion, what benefits UWC 2.0 will be for each stakeholder?**

### **1.1.2 Who are relevant stakeholders? What are their current needs? Trong dự án này, Stakeholder bao gồm**

- End User:\
&#8722; Back officer: Lên lịch và phân công nhiệm vụ cho Collectors và Janitors, thực hiện nhiệm vụ quản lý\
&#8722; Collectors : Điều khiển phương tiện chuyên dụng tới các điểm MCPs\
&#8722; Janitors : Dùng xe phương tiện chuyên dụng thu gom rác từ customer tới các điểm MCPs\
&#8722; Super back officer : Người quản lý toàn bộ (Back Officers, Collectors, Janitors)\
&#8722; Giám đốc: Người kí hợp đồng mới.\

- Công ty phần mềm:\
&#8722; IT staff : Thiết kế vận hành và bảo trì hệ thống.\
&#8722; BA : Phân tích yêu cầu của khách hàng.\
&#8722; PM : quản lý tiến độ dự án.

- Customer:\
&#8722; Hộ gia đình, tổ chức và doanh nghiệp: Người sử dụng dịch vụ, có thể quan sát để lên kế
hoạch vứt rác phù hợp, biết được chi phí phải trả hàng tháng và phản ánh dịch vụ.\
&#8722; Chính phủ và các công ty chính phủ liên quan: Có thể báo cáo đến hệ thống những vấn
đề khiến hệ thống cần phải tạm dừng như thời tiết, khi có bộ luật liên quan thay đổi,...\

#### **Nhu cầu của các Stakeholder như sau**

- End User:\
&#8722; Back officer:\
∗ Có thông tin tổng quan về janitors và collectors, lịch làm việc của họ\
∗ Có thông tin tổng quan về xe và chi tiết kỹ thuật của từng xe\
∗ Có thông tin tổng quan về MCPs và sức chứa của nó\
∗ Có thể theo dõi quá trình đi thu gom rác của từng xe\
∗ Có thể gửi tin nhắn cho collectors và janitors\
∗ Được thông báo về MCPs nếu nó đầy\
∗ Có thể nhắn tin, và đọc các thông báo với người dùng\
∗ Cần xem được thông báo mới từ hệ thống\
∗ Xem review người dùng

- Collectors & Janitors :\
∗ Có tổng quan về lịch làm việc\
∗ Có chi tiết về nhiệm vụ hàng ngày và hằng tuần\
∗ Có thể giao tiếp với collectors, janitors khác và back officers\
∗ Cần xem được thông báo mới từ hệ thống\
∗ Xem review người dùng
- Giám đốc:\
∗ Quan sát được các thông tin về hệ thống để ra quyết định nâng cấp hệ thống và có thể
phân tích hệ thống với đối tác trong việc kí hợp đồng\
∗ Quan sát được các thông tin về công việc của nhân viên
- Super back officer:\
∗ Đảm bảo hệ thống có khả năng chạy đúng đáp ứng thời gian thực\
∗ Áp dụng công nghệ trong quản lý để giảm thiểu thời gian và chi phí\
∗ Quản lý các bộ phận công ty hoạt động một cách đúng đắn\
∗ Có các thông tin về bộ phận cấp dưới\
∗ Viết thông báo mới về nội dung hệ thống sau khi cập nhật hoặc các sự kiện đặc biệt.\
∗ Xem review người dùng\
• Công ty phần mềm:
- IT staff :\
∗ Được cung cấp các technical phù hợp\
∗ Có các tài liệu có liên quan\
∗ Có lịch trình rõ ràng
- BA : Biết được yêu cầu của khác hàng
- PM : Có thông tin khách hàng, đội ngũ nhân viên
- Customer:\
∗ Dịch vụ đáp ứng được nhu cầu\
∗ Có chi phí hợp lí

### **1.1.3 In your opinion, what benefits UWC 2.0 will be for each stakeholder?**

- Back officer:\
– Dễ dàng quản lí, giám sát và phân công nhiệm vụ cho Collectors and Janitors\
– Nắm được dữ liệu MCPs trực tiếp trên bản đồ điện tử\
– Tận dụng công nghệ AI, IOT để hỗ trợ xử lí công việc hiệu quả hơn
- Collectors & Janitors
– Hiểu rõ tường minh nhiệm vụ công việc, tăng năng suất công việc
- Customer
– Tiết kiệm chi phí xử lí rác thải, đảm bảo mỹ quan đô thị và quyền lợi khi sử dụng sản
phẩm.
- Super back officer
– Quản lý được các nhân viên của mình, đảm bảo các công việc của giám đốc
diễn ra thuận lợi
- Giám đốc
– Dựa vào dữ liệu thu được nắm được tình hình để có thể thực hiện định hướng tiếp
theo cho công ty

## **Task 1.2 Chức năng dự kiến**
<br>

### **1.2.1 Describe all functional and non-functional requirements that can be inferred from the project description**
<br>

#### **1.2.1.1 Functional**
<br>

Tính năng chung: chat realtime, trao đổi thông tin, thông báo, chỉnh sửa và cập nhật thông tin cá nhân,
quan sát bản đồ thấy các phương tiện vận chuyển đang trong nhiệm vụ hoạt động.

1. Back Officers :

- Phân công nhiệm vụ cho janitors và collectors
- Xem được lịch biểu, bản đồ, phương tiện, thông tin về tất cả janitors và collectors (calendar
UI riêng cho back officers)
- Thông báo về chi tiết công việc cho các janitors và collectors
- Xem được thông tin về các MCPs
- Đảm bảo được sự công bằng về công việc giữa các janitors và collectors
- Quản lý trang web như cài đặt về các thông tin cơ bản xuất hiện trên mặt tiền web
- Xem được thông báo mới hệ thống khi cập nhật hoặc các sự kiện đặc biệt
  
2. Janitors, Collectors :

- Xem được thông báo, chi tiết công việc được phân công từ các back officers
- Xem công việc (thời gian, địa điểm) qua một lịch biểu rõ ràng theo tuần hoặc theo ngày
(calendar UI riêng cho janitors, collectors)
- Collectors xem được đường đi cụ thể thông qua sự sắp xếp của back officers. Janitors nắm rõ
các MCPs mà mình cần phải đổ rác vào
- Checkin/checkout chấm công mỗi ngày
- Xem được thông báo mới hệ thống khi cập nhật hoặc các sự kiện đặc biệt.

3. Admin system :

- Cấp tài khoản cho back officers, janitors, collectors
- Xem được các dữ liệu trích xuất từ công ty trong quá trình hoạt động
- Quan sát được các ý kiến của user về công ty và các báo cáo sự cố của janitors và collectors
trong quá trình hoạt động.
- Quan sát được thông tin về các phương tiện xe của công ty mình
- Có được các Logs về hoạt động của back officers, janitors, collectors
- Quản lý trang web như cài đặt bảo trì
- Viết thông báo mới về nội dung hệ thống khi cập nhật hoặc các sự kiện đặc biệt.
- Xem thông tin của các janitors, Collectors và back officer.
- Có thể giao tiếp hay nhắn tin với các janitors, Collectors và back officer

4. User là hộ dân, doanh nghiệp :

- Có hộp thư để báo cáo sự cố, hộp thoại tư vấn
- Quan sát được thời gian phương tiện vận chuyển sẽ đến chỗ mình
- Quan sát được các thông báo mới nhất về công ty như dừng làm việc ngày lễ,. . 


#### **1.2.1.2 Non-functional**

<br>

![1.2.1.1-1.png](/pictures/Task1/1.2.1.1-1.png?raw=true)
<br>


### **1.2.2 Draw a use-case diagram for the whole system**
<br>

![1.2.2-1.png](/pictures/Task1/1.2.2-1.png?raw=true)
<br>

#### **Hình 1.2: Use-case diagram cho toàn bộ hệ thống**

**[Link to google drive](https://drive.google.com/file/d/1mUXlPXcTUjHFyZXjKRO0sx3bpjcn5Rl0/view)**
<!-- make the picture centered -->

<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task1/1.2.1.1-2.png?raw=true" alt="1.2.1.1-2.png"/>
</p>


#### **Bảng danh sách các actor**
<br>

![1.2.1.1-3.png](/pictures/Task1/1.2.1.1-3.png?raw=true)

<br>

## **Task 1.3 For the Task assignment module, draw its use-case diagram and describe the use-case using a table format**

<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task1/1.3-1.png?raw=true" alt="1.3-1.png"/>
</p>

#### **Use-case diagram cho module phân công nhiệm vụ**

**[Link to google drive](https://drive.google.com/file/d/16KF7FsB64_N8_SJT8eT3SHvaRNM_d-BF/view)**

<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task1/1.3-2.png?raw=true" alt="1.3-2.png"/>
</p>


<br>
<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task1/1.3-3.png?raw=true" alt="1.3-3.png"/>
</p>


<br>
<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task1/1.3-4.png?raw=true" alt="1.3-4.png"/>
</p>


<br>
<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task1/1.3-5.1.png?raw=true" alt="1.3-5.1.png"/>
</p>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task1/1.3-5.2.png?raw=true" alt="1.3-5.2.png"/>
</p>


<br>

### **1.3.1 Describe all functional and non-functional requirements that can be inferred from the project description**
<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task1/1.3-6.1.png?raw=true" alt="1.3-6.1.png"/>
</p>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task1/1.3-6.2.png?raw=true" alt="1.3-6.2.png"/>
</p>
<br>
<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task1/1.3-7.png?raw=true" alt="1.3-7.png"/>
</p>
<br>
<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task1/1.3-8.png?raw=true" alt="1.3-8.png"/>
</p>
<br>
<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task1/1.3-9.png?raw=true" alt="1.3-9.png"/>
</p>
<br>
<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task1/1.3-10.png?raw=true" alt="1.3-10.png"/>
</p>
<br>
<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task1/1.3-11.png?raw=true" alt="1.3-11.png"/>
</p>

### **1.3.2 Module chỉ định công việc cho collectors và janitors**
<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task1/1.3-12.png?raw=true" alt="1.3-12.png"/>
</p>
<br>
<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task1/1.3-13.png?raw=true" alt="1.3-13.png"/>
</p>
<br>
<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task1/1.3-14.png?raw=true" alt="1.3-14.png"/>
</p>
<br>
<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task1/1.3-15.png?raw=true" alt="1.3-15.png"/>
</p>

### **1.3.3 Module chỉ định công việc cho collectors và janitors**
<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task1/1.3-16.png?raw=true" alt="1.3-16.png"/>
</p>
<br>
<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task1/1.3-17.png?raw=true" alt="1.3-17.png"/>
</p>
<br>
<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task1/1.3-18.png?raw=true" alt="1.3-18.png"/>
</p>
<br>
<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task1/1.3-19.png?raw=true" alt="1.3-19.png"/>
</p>

### **1.3.4 Module gửi tin nhắn cho collectors và janitors**
<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task1/1.3-20.png?raw=true" alt="1.3-20.png"/>
</p>
<br>
<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task1/1.3-21.png?raw=true" alt="1.3-21.png"/>
</p>