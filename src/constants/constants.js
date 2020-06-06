export const ROLES = { teacher: 'Teacher', student: 'Student' };
export const list_screen = [
  { showRole: [ROLES.student, ROLES.teacher], icon: 'home', text: 'Home', title: 'BK Attendance', to: '/' },
  {
    showRole: [ROLES.student, ROLES.teacher],
    icon: 'view-list',
    customIcon: 'sort',
    customText: 'sort',
    text: 'Rooms',
    title: 'Danh sách lớp',
    to: '/list-room',
    showSearch: true,
  },
  { showRole: [ROLES.student, ROLES.teacher], icon: 'face-recognition', text: 'Face', title: 'Đăng kí gương mặt', to: '/register-face' },
  { showRole: [ROLES.student], icon: 'history', text: 'History', title: 'Lịch sử điểm danh', to: '/history' },
  { showRole: [ROLES.student, ROLES.teacher], icon: 'account', text: 'Account', title: 'Tài khoản', to: '/account' },
];
export const list_screen_map = {
  home: { icon: 'home', text: 'Bach khoa Attendance Application', title: 'BK Attendance', to: '/' },
  listRoom: { icon: 'view-list', customIcon: 'sort', customText: 'sort', text: 'Rooms', title: 'Danh sách phòng', to: '/list-room', showSearch: true },
  registerFace: { icon: 'face-recognition', text: 'Face', title: 'Đăng kí gương mặt', to: '/register-face' },
  history: { icon: 'history', text: 'History', title: 'Lịch sử điểm danh', to: '/history' },
  account: { icon: 'account', text: 'Account', title: 'Tài khoản', to: '/account' },
  login: { icon: 'account', text: 'Account', title: 'Đăng nhập', to: '/account' },
  register: { icon: 'account', text: 'Account', title: 'Đăng kí tài khoản', to: '/account' },
  checkIn: { icon: 'face-recognition', text: 'Account', title: 'Điểm danh', to: '/account' },
  forgotpass: { icon: 'account', text: 'Account', title: 'Lấy lại mật khẩu', to: '/account' },
  stat: { icon: 'format-list-checks', text: 'Account', title: 'Thống kê tiết học', to: '/stat' },
};
export const facultys = [
  'KH & KT Máy Tính',
  'Bảo Dưỡng Công Nghiệp',
  'Kỹ Thuật Giao Thông',
  'Kỹ Thuật Xây Dựng',
  'Công Nghệ Vật Liệu',
  'Khoa Học Ứng Dụng',
  'Quản Lý Công Nghiệp',
  'Cơ Khí',
  'Địa Chất - Dầu Khí',
  'Điện - Điện Tử',
  'Kỹ Thuật Hóa Học',
  'Môi Trường',
];
