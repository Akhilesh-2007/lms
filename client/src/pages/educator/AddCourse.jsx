import React, { useEffect, useRef ,useState} from 'react'
import uniqid from 'uniqid'
import Quill from 'quill'
import { useAuth } from '@clerk/clerk-react'
import { assets } from '../../assets/assets'

const AddCourse = () => {
  const { getToken } = useAuth()
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

  const quillRef=useRef(null)
  const editorRef=useRef(null)

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup,setShowPopup]=useState(false);
  const [currentChapterId,setCurrentChapterId]=useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const [lectureDetails,setLectureDetails]=useState(
    {
      lectureTitle:'',
      lectureDuration:'',
      lectureurl:'',
      isPreviewFree:false,
    }
  )

  const handleChapter = (action, chapterId) => {
  if (action === 'add') {
    const title = prompt('Enter Chapter Name:');
    if (title) {
      const newChapter = {
        chapterId: uniqid(),
        chapterTitle: title,
        chapterContent: [],
        collapsed: false,
        chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
      };
      setChapters([...chapters, newChapter]);
    }
  } else if (action === 'remove') {
    setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
  }
  else if (action === 'toggle') {
  setChapters(
    chapters.map((chapter) =>
      chapter.chapterId === chapterId
        ? { ...chapter, collapsed: !chapter.collapsed }: chapter
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
  if (action === 'add') {
    setCurrentChapterId(chapterId);
    setShowPopup(true);
  } else if (action === 'remove') {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === chapterId) {
          chapter.chapterContent.splice(lectureIndex, 1);
          }
          return chapter;
        })
      );
    }
  };

  const addLecture = () => {
  setChapters(
    chapters.map((chapter) => {
      if (chapter.chapterId === currentChapterId) {
        const newLecture = {
          ...lectureDetails,
          lectureOrder:
            chapter.chapterContent.length > 0
              ? chapter.chapterContent.slice(-1)[0].lectureOrder+1:1,
          lectureId: uniqid(),
        };
        chapter.chapterContent.push(newLecture);
      }
      return chapter;
    })
  );
  setShowPopup(false);
  setLectureDetails({
    lectureTitle: '',
    lectureDuration: '',
    lectureurl: '',
    isPreviewFree: false,
  });
};

  const handleSubmit=async(e)=>{
    e.preventDefault()
    setSubmitMessage('')

    if(!image){
      setSubmitMessage('Course thumbnail is required')
      return
    }

    if(chapters.length === 0){
      setSubmitMessage('Add at least one chapter before submitting')
      return
    }

    const courseDescription = quillRef.current?.root.innerHTML || ''

    const normalizedChapters = chapters.map((chapter) => ({
      chapterId: chapter.chapterId,
      chapterOrder: chapter.chapterOrder,
      chapterTitle: chapter.chapterTitle,
      chapterContent: chapter.chapterContent.map((lecture) => ({
        lectureId: lecture.lectureId,
        lectureTitle: lecture.lectureTitle,
        lectureDuration: Number(lecture.lectureDuration),
        lectureurl: lecture.lectureurl,
        isPreviewFree: lecture.isPreviewFree,
        lectureOrder: lecture.lectureOrder,
      })),
    }))

    const payload = {
      courseTitle,
      courseDescription,
      coursePrice: String(coursePrice),
      discount: Number(discount),
      isPublished: true,
      courseContent: normalizedChapters,
    }

    try {
      setIsSubmitting(true)
      const token = await getToken()

      const formData = new FormData()
      formData.append('image', image)
      formData.append('courseData', JSON.stringify(payload))

      const response = await fetch(`${backendUrl}/api/educator/add-course`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()

      if(!response.ok || !data.success){
        throw new Error(data.message || 'Failed to add course')
      }

      setSubmitMessage('Course added successfully')
      setCourseTitle('')
      setCoursePrice(0)
      setDiscount(0)
      setImage(null)
      setChapters([])
      if(quillRef.current){
        quillRef.current.root.innerHTML = ''
      }
    } catch (error) {
      setSubmitMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(()=>{
    if(!quillRef.current && editorRef.current){
      quillRef.current=new Quill(editorRef.current,{
        theme:'snow',
      });
    }
  },[])

  return (
    <div className='h-screen overflow-scroll flex flex-col items-start
    justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0 bg-[#0a0a12]'>
      <form onSubmit={handleSubmit} className='w-full max-w-4xl'>
        <div className="flex flex-col gap-2 mb-6">
          <p className='text-gray-200 font-bold'>Course Title</p>
          <input
            onChange={e => setCourseTitle(e.target.value)}
            value={courseTitle} type="text" placeholder="Enter course title" 
            className="bg-[#11111e] text-gray-200 outline-none md:py-3 py-2 px-4 rounded border border-gray-700/50 focus:border-blue-500/50 transition-all"
            required/>
        </div>
        <div className='flex flex-col gap-2 mb-6'>
          <p className='text-gray-200 font-bold'>Course Description</p>
          <div ref={editorRef} className='rounded-md overflow-hidden'></div>
        </div>
        <div className="flex md:flex-row flex-col items-start justify-between gap-6 mb-6">
          <div className="flex flex-col gap-2">
            <p className='text-gray-200 font-bold'>Course Price</p>
            <input
              onChange={e => setCoursePrice(e.target.value)}
              value={coursePrice} type="number" placeholder="0"
              className="bg-[#11111e] text-gray-200 outline-none md:py-3 py-2 w-full md:w-32 px-4 rounded border border-gray-700/50 focus:border-blue-500/50 transition-all" required/>
          </div>
          <div className="flex flex-col gap-2">
            <p className='text-gray-200 font-bold'>Course Thumbnail</p>
            <label htmlFor="thumbnailImage" className="flex items-center gap-4 cursor-pointer">
              <div className='flex items-center gap-3 bg-blue-600/10 border border-blue-500/30 px-4 py-2.5 rounded hover:bg-blue-600/20 transition-all'>
                <img src={assets.file_upload_icon} alt="" className="w-5 invert opacity-70"/>
                <span className='text-blue-400 text-sm font-medium'>Upload Image</span>
              </div>
              <input
                type="file" id="thumbnailImage"
                onChange={e => setImage(e.target.files[0])} accept="image/*" hidden/>
              {image && <img className="h-10 rounded border border-gray-700" src={URL.createObjectURL(image)} alt=""/>}
            </label>
          </div>
          <div className="flex flex-col gap-2">
            <p className='text-gray-200 font-bold'>Discount %</p>
            <input
              onChange={e => setDiscount(e.target.value)} value={discount} type="number" placeholder="0" min={0} max={100}
              className="bg-[#11111e] text-gray-200 outline-none md:py-3 py-2 w-full md:w-32 px-4 rounded border border-gray-700/50 focus:border-blue-500/50 transition-all"
              required/>
          </div>
        </div>

        {/* Adding chapters & lectures*/}
        <div className='mt-10'>
          <h3 className='text-xl font-semibold text-gray-100 mb-6'>Course Curriculum</h3>
          {chapters.map((chapter,chapterIndex)=>(
            <div key={chapterIndex} className='bg-[#11111e] border border-gray-700/50 rounded-lg mb-4 overflow-hidden'>
              <div className='flex justify-between items-center p-4 border-b border-gray-700/50 bg-[#161625]'>
                <div className='flex items-center'>
                  <img onClick={()=>handleChapter('toggle',chapter.chapterId)} src={assets.dropdown_icon} width={14} alt="" className={`
                    mr-3 cursor-pointer transition-all invert opacity-60 ${chapter.collapsed && 
                      "-rotate-90"}`}/>
                  <span className='font-semibold text-gray-200'>{chapterIndex+1}. {chapter.chapterTitle}</span>
                </div>
                <div className='flex items-center gap-4'>
                  <span className='text-gray-500 text-sm hidden md:block'>{chapter.chapterContent.length} Lectures</span>
                  <img onClick={()=>handleChapter('remove',chapter.chapterId)} src={assets.cross_icon} alt="" className='w-3.5 cursor-pointer opacity-50 hover:opacity-100 invert transition-all'/>
                </div>
              </div>
              {!chapter.collapsed && (
                <div className='p-4 bg-[#0d0d18]'>
                  {chapter.chapterContent.map((lecture,lectureIndex)=>(
                    <div key={lectureIndex} className='flex justify-between
                      items-center mb-3 bg-[#161625] p-3 rounded border border-gray-700/30'>
                      <div className='flex flex-col'>
                        <span className='text-gray-200 text-sm font-medium'>
                          {lectureIndex + 1}. {lecture.lectureTitle}
                        </span>
                        <div className='flex items-center gap-3 text-[12px] text-gray-500 mt-0.5'>
                          <span>{lecture.lectureDuration} mins</span>
                          <span className='text-gray-700'>|</span>
                          <a href={lecture.lectureurl} target="_blank" className="text-blue-400 hover:underline">View Link</a>
                          <span className='text-gray-700'>|</span>
                          <span className={lecture.isPreviewFree ? 'text-green-500/80' : 'text-gray-500'}>{lecture.isPreviewFree ? "Free Preview" : "Paid"}</span>
                        </div>
                      </div>
                      <img src={assets.cross_icon} alt="" className='w-3 cursor-pointer opacity-40 hover:opacity-100 invert transition-all'
                      onClick={()=>handleLecture('remove',chapter.chapterId,lectureIndex)}/>
                    </div>
                  ))}
                  <div className='inline-flex items-center gap-2 bg-blue-600/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded
                  cursor-pointer mt-2 text-sm font-medium hover:bg-blue-600/20 transition-all' onClick={()=>handleLecture('add',chapter.chapterId)}>+ Add Lecture</div>
                </div>
              )}
            </div>
          ))}
          <div className='flex justify-center items-center bg-gray-800/40 border border-dashed border-gray-600/50 p-4
          rounded-lg cursor-pointer text-gray-300 hover:bg-gray-800/60 hover:border-gray-500/50 transition-all font-medium mb-10' onClick={()=>handleChapter('add')}>+ Add Chapter</div>
          
          {showPopup && (
            <div className='fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-[100]'>
              <div className='bg-[#161625] text-gray-200 p-6 rounded-lg border border-gray-700 shadow-2xl relative w-full
              max-w-md'>
                <h2 className='text-xl font-semibold mb-6 text-gray-100 border-b border-gray-700 pb-3'>Add Lecture</h2>
                <div className="mb-4">
                  <p className='text-sm text-gray-400 mb-1.5'>Lecture Title</p>
                  <input
                    type="text"
                    placeholder="e.g. Introduction to React"
                    className="w-full bg-[#0d0d18] border border-gray-700 rounded py-2 px-3 outline-none focus:border-blue-500/50 text-gray-200"
                    value={lectureDetails.lectureTitle}
                    onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className='text-sm text-gray-400 mb-1.5'>Duration (mins)</p>
                    <input
                      type="number"
                      placeholder="e.g. 15"
                      className="w-full bg-[#0d0d18] border border-gray-700 rounded py-2 px-3 outline-none focus:border-blue-500/50 text-gray-200"
                      value={lectureDetails.lectureDuration}
                      onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
                    />
                  </div>
                  <div className='flex items-center gap-3 pt-6'>
                    <input
                      type="checkbox"
                      id="isPreviewFree"
                      className="accent-blue-600 w-4 h-4"
                      checked={lectureDetails.isPreviewFree}
                      onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
                    />
                    <label htmlFor="isPreviewFree" className='text-sm text-gray-300 cursor-pointer'>Free Preview?</label>
                  </div>
                </div>
                <div className="mb-6">
                  <p className='text-sm text-gray-400 mb-1.5'>Lecture URL</p>
                  <input
                    type="text"
                    placeholder="YouTube or Video Link"
                    className="w-full bg-[#0d0d18] border border-gray-700 rounded py-2 px-3 outline-none focus:border-blue-500/50 text-gray-200"
                    value={lectureDetails.lectureurl}
                    onChange={(e) => setLectureDetails({ ...lectureDetails, lectureurl: e.target.value })}
                  />
                </div>
                
                <div className='flex gap-3'>
                  <button type='button' className='flex-1 bg-gray-700 text-gray-200 px-4
                  py-2.5 rounded font-medium hover:bg-gray-600 transition-all' onClick={() => setShowPopup(false)}>Cancel</button>
                  <button type='button' className='flex-1 bg-blue-600 text-white px-4
                  py-2.5 rounded font-medium hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20' onClick={addLecture}>Add Lecture</button>
                </div>
                
                <img
                  onClick={() => setShowPopup(false)} src={assets.cross_icon}
                  className='absolute top-6 right-6 w-3.5 cursor-pointer opacity-40 hover:opacity-100 invert' alt="close"
                />
              </div>
            </div>
          )}
        </div>

        <div className='flex items-center justify-between mt-10 mb-20 border-t border-gray-700/50 pt-8'>
          {submitMessage && (
            <p className={`text-sm font-medium ${submitMessage.includes('success') ? 'text-green-400' : 'text-red-400'}`}>{submitMessage}</p>
          )}
          <button type='submit' className='bg-blue-600 text-white py-3 px-10
          rounded font-semibold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 ml-auto' disabled={isSubmitting}>
            {isSubmitting ? 'PROCESSING...' : 'PUBLISH COURSE'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddCourse
