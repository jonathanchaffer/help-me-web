class TextMatcherService
	def initialize
		@filter = Stopwords::Snowball::Filter.new "en"
	end

  def score(search_text, question_text)
		search_words = search_text.downcase.split
		question_words = question_text.downcase.split

		#  Eliminate common stop words
		filtered_search_words = @filter.filter(search_words).to_set
		puts "Filtered search words"
		filtered_search_words.each do |w|
			puts w
		end

		filtered_question_words = @filter.filter(question_words).to_set
		puts "Filtered question words"
		filtered_question_words.each do |w|
			puts w
		end

		#  Count how many of the search_words appear in filtered_question_words
		matches = filtered_search_words.count { |w| filtered_question_words.include? w}

		puts "Matches = #{matches}"
		return 1.0*matches / filtered_search_words.length
	end

	def match(text)

		text = "This is the way to Grandmother's house"
		return @filter.filter(text.split)
	end
end

class QuestionsController < ApplicationController
  before_action :authenticate_user!
  before_action :find_question!, except: [:index, :create, :show_user_questions]

  def index
    sess = current_user.lab_sessions.find(params[:lab_session_id])
    render json: sess.questions.order(created_at: :asc), each_serializer: QuestionSerializer, include: [:lab_session, 'lab_session.course', 'lab_session.users', :answer]
  end

  def show
    render json: @question
  end

  def update
    @question.update!(question_params)

    render json: @question
  end

  def create
    approved_params = question_params.merge!({ original_asker_id: current_user.id })
    render json: current_user.questions_asked.create!(approved_params)
  end

  def destroy
    if current_user.professor? || @question.askers.count == 1 # The only person is the current user
      @question.destroy!
      head :no_content, status: 204
    else
      render_cannot_perform_operation("This user must be the only one that has asked this question")
    end
  end

  def claim
    @question.claim(current_user)

    render json: @question
  end

  def assign
    user = User.find(params[:user_id])
    if user.ta? || user.professor?
      @question.assign_to(user)

      render json: @question
    else
      render_cannot_perform_operation("User must be a TA in order to assign them a question.")
    end
  end

  def tags
    render json: tag_json(@question.tags)
  end

  def add_tag
    # Finds tags on the question's course with the given tag
    tags = Tag.joins("inner join courses_tags on courses_tags.course_id = '#{@question.lab_session.course.id}' where tags.name = '#{params[:tag]}'") if @question.lab_session.course.present?

    # Puts them together with all of the global ones
    tags += Tag.global

    tags.map { |t| t.name == params[:tag] }
    if tags.any?
      @question.tags << tags.flatten
      render json: tag_json(@question.tags)
    else
      raise ActiveRecord::RecordNotFound
    end
  end

  def remove_tag
    tag = @question.tags.find_by!(name: params[:tag])
    @question.tags.delete(tag)
    @question.save!

    render json: tag_json(@question.tags)
  end

  def show_user_questions
		#  Find all of the questions that this user has asked, either as the original asker, or through the
		#  "Me Too!" mechanism
		questions = Question.joins(:askers).where("user_id = '#{current_user.id}'")
		render json: questions, include: [:lab_session, 'lab_session.course', 'lab_session.users', :answer]
	end

  private

  def question_params
    params.permit(:text, :lab_session_id, :claimed_by_id, :faq, :step)
  end

  def find_question!
    @question = current_user.lab_sessions.find(params[:lab_session_id]).questions.find(params[:id])
  end
end
