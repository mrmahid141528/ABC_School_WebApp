import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = 'max-w-md',
    isBottomSheetOnMobile = true
}) => {
    return (
        <Transition show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Backdrop */}
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className={`flex min-h-full items-end justify-center text-center sm:items-center sm:p-4 
            ${isBottomSheetOnMobile ? 'p-0 pb-0' : 'p-4'}`}>
                        <Transition.Child
                            as={React.Fragment}
                            // Modal animation logic (Bottom sheet on mobile, fade/scale on desktop)
                            enter="ease-out duration-300 transform"
                            enterFrom={`opacity-0 translate-y-full sm:translate-y-0 sm:scale-95`}
                            enterTo={`opacity-100 translate-y-0 sm:scale-100`}
                            leave="ease-in duration-200 transform"
                            leaveFrom={`opacity-100 translate-y-0 sm:scale-100`}
                            leaveTo={`opacity-0 translate-y-full sm:translate-y-0 sm:scale-95`}
                        >
                            <Dialog.Panel
                                className={`relative transform overflow-hidden bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:rounded-2xl ${maxWidth}
                  ${isBottomSheetOnMobile ? 'rounded-t-2xl sm:rounded-2xl' : 'rounded-2xl'}
                `}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-text-main">
                                        {title}
                                    </Dialog.Title>
                                    <button
                                        type="button"
                                        className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-500 transition-colors focus:outline-none"
                                        onClick={onClose}
                                    >
                                        <X className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="px-6 py-5">
                                    {children}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default Modal;
