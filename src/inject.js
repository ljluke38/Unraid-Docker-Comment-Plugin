\$(function() {
    // 1. Target the Unraid core Docker manager container table
    const dockerTable = \$('#docker_containers');
    if (!dockerTable.length) return;

    // 2. Append the "Comments" title block to the table header row
    dockerTable.find('thead tr').append('<th class="comments-header">Comments</th>');

    // 3. Request our backend JSON data database asynchronously
    \$.getJSON('/plugins/docker-comments/api.php', function(commentsData) {
        
        // 4. Traverse every container row populated by Unraid
        dockerTable.find('tbody tr.ct-row').each(function() {
            const row = \$(this);
            const containerName = row.find('.ct-name').text().trim(); 
            const currentComment = commentsData[containerName] || '';

            // Build out an adjustable visual box template
            const inputHtml = `<td class="ct-comment">
                <input type="text" class="comment-box" data-container="${containerName}" 
                       value="${currentComment}" placeholder="Add notes..." 
                       style="width:90%; background:transparent; border:1px solid #444; color:#fff; padding:4px 8px; border-radius:4px;" />
            </td>`;
            
            row.append(inputHtml);
        });

        // 5. Instantly upload changes over AJAX when clicking outside or hitting Enter
        dockerTable.on('blur', '.comment-box', function() {
            const input = \$(this);
            const payload = {
                container: input.data('container'),
                comment: input.val()
            };

            \$.ajax({
                url: '/plugins/docker-comments/api.php',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(payload),
                success: function() {
                    // Flash the input border green temporarily to visually signify the auto-save
                    input.css('border-color', '#2ecc71');
                    setTimeout(() => { input.css('border-color', '#444'); }, 1000);
                }
            });
        });
    });
});
