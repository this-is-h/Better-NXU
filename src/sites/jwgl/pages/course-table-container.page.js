/** 教务课表容器：等待学校 iframe 后安装页面内的高度同步。 */
import { waitOrToast } from '../../../composables/use-wait-or-toast.js';
import { installCourseFrameResize } from '../components/course-table/course-frame.js';
import { MyConsole } from '../../../utils/console.js';

const console = MyConsole('[jwgl CourseFrame]');

export async function register() {
  console('进入课表容器页');
  const iframe = await waitOrToast('#contentListFrame', {
    timeout: 15000,
    level: 'warning',
    duration: 4,
  });
  if (iframe) installCourseFrameResize(iframe);
}
