MODULES.pages = {
    init: function () {
        document.addEventListener("DOMContentLoaded", function () {
            // Kiểm tra xem trình duyệt có hỗ trợ navigator.share không
            if (navigator.share) {
                // Nếu hỗ trợ, thêm class .show cho button#btnSharePage
                var shareButton = document.getElementById("btnSharePage");
                shareButton.classList.add("show");

                // Bắt sự kiện click cho button#btnSharePage
                shareButton.addEventListener("click", function () {
                    // Dữ liệu cần chia sẻ
                    const data = {
                        title: 'Nguyen Thanh Phong aka Peter',
                        text: 'Checkout his personal page',
                        url: 'https://phong.info/',
                    };

                    // Kiểm tra nếu có thể chia sẻ
                    if (navigator.canShare(data)) {
                        // Chia sẻ dữ liệu
                        navigator.share(data)
                            .then(() => {
                                console.log("Chia sẻ thành công.");
                            })
                            .catch((error) => {
                                console.error("Lỗi khi chia sẻ:", error);
                            });
                    } else {
                        console.log("Trình duyệt không hỗ trợ chia sẻ dữ liệu này.");
                    }
                });
            } else {
                //console.log("Trình duyệt của bạn không hỗ trợ chia sẻ.");
            }
        });


    },

};

// Initialize module:
MODULES.pages.init();

